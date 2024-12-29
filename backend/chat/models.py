from django.db import models


class Messages(models.Model):
    message = models.CharField(max_length=255)
    type = models.CharField(max_length=255)  # user or bot
    created_at = models.DateTimeField(auto_now_add=True)
    session_key = models.CharField(max_length=255)
