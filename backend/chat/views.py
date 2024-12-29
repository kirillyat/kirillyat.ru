from .models import Messages
from django.views.decorators import http
from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
import json
from .ollama import process


@csrf_exempt
def message(request: HttpRequest):
    data = json.loads(request.body.decode("utf-8"))

    response = process(data["user_text"])
    return HttpResponse(
        status=200,
        content=json.dumps(
            {"ai_text": response.message.content, "user_text": data["user_text"]}
        ),
        content_type="application/json",
    )


@http.require_http_methods(["GET"])
def chat(request):
    messages = Messages.objects.filter(session=request.session.session_key).order_by(
        "created_at"
    )
    return messages
