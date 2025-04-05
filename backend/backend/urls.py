"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from feed.views import post, feed
from chat.views import message, chat_history, clear_chat
from resume.views import (
    resume_data,
    folders_list,
    folder_detail,
    lectures_list,
    lecture_detail,
    mentoring_sessions,
    book_session,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("feed/", feed),
    path("post/", post),
    path("message/", message),
    path("chat/history/", chat_history, name="chat_history"),
    path("chat/clear/", clear_chat, name="clear_chat"),
    # Resume endpoints
    path("resume/", resume_data, name="resume_data"),
    # Lecture folders endpoints
    path("folders/", folders_list, name="folders_list"),
    path("folders/<slug:slug>/", folder_detail, name="folder_detail"),
    # Lectures endpoints
    path("lectures/", lectures_list, name="lectures_list"),
    path("lectures/<slug:slug>/", lecture_detail, name="lecture_detail"),
    # Mentoring endpoints
    path("mentoring/sessions/", mentoring_sessions, name="mentoring_sessions"),
    path("mentoring/book/<int:session_id>/", book_session, name="book_session"),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
