import json
from .models import Messages
from django.views.decorators import http
from .ollama import process
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def message(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body.decode("utf-8"))
            user_text = payload.get("user_text", "")  # получаем текст пользователя

            if not user_text:
                return HttpResponseBadRequest("User text is missing!")

            ai_response = process(user_text)["message"]["content"]

            return JsonResponse({"ai_text": ai_response})

        except json.JSONDecodeError as e:
            return HttpResponseBadRequest("Invalid JSON provided.")
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return HttpResponseBadRequest("Invalid request method.")


@http.require_http_methods(["GET"])
def chat(request):
    messages = Messages.objects.filter(session=request.session.session_key).order_by(
        "created_at"
    )
    return messages
