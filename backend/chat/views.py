import json
import uuid
from django.views.decorators import http
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .models import Conversation, Message
from .ollama import process, get_or_create_conversation


@csrf_exempt
def message(request):
    """Handle incoming chat messages"""
    if request.method == "POST":
        try:
            # Get or set session ID
            session_id = request.session.get("chat_session_id")
            if not session_id:
                session_id = str(uuid.uuid4())
                request.session["chat_session_id"] = session_id

            # Parse the request
            payload = json.loads(request.body.decode("utf-8"))
            user_text = payload.get("user_text", "")

            if not user_text:
                return HttpResponseBadRequest("User text is missing!")

            # Process the message with Ollama
            ai_response = process(user_text, session_id)["message"]["content"]

            return JsonResponse({"ai_text": ai_response})

        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON provided.")
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return HttpResponseBadRequest("Invalid request method.")


@http.require_http_methods(["GET"])
def chat_history(request):
    """Get chat history for the current session"""
    session_id = request.session.get("chat_session_id")

    if not session_id:
        return JsonResponse({"messages": []})

    conversation = get_or_create_conversation(session_id)
    messages = conversation.messages.exclude(role="system").values(
        "role", "content", "created_at"
    )

    # Format messages for the frontend
    formatted_messages = []
    for i in range(0, len(messages), 2):
        if i + 1 < len(messages):
            formatted_messages.append(
                {
                    "user_text": messages[i]["content"],
                    "ai_text": messages[i + 1]["content"],
                    "timestamp": messages[i]["created_at"].isoformat(),
                }
            )

    return JsonResponse({"messages": formatted_messages})


@csrf_exempt
@http.require_http_methods(["POST"])
def clear_chat(request):
    """Clear the chat history for the current session"""
    session_id = request.session.get("chat_session_id")

    if session_id:
        try:
            conversation = Conversation.objects.get(session_id=session_id)
            # Delete all messages except the system prompt
            conversation.messages.exclude(role="system").delete()
            return JsonResponse({"status": "success"})
        except Conversation.DoesNotExist:
            pass

    return JsonResponse({"status": "no_conversation"})
