from django.shortcuts import render
from django.http import HttpResponse
from .models import Posts
from django.views.decorators import http


@http.require_http_methods(["POST", "GET", "DELETE"])
def post(request):
    if request.method == "GET":
        post = Posts.objects.filter(id=request.GET.get("id"))
        if post is None:
            return HttpResponse(status=404, content="Not Found")
        return post
    elif request.method == "POST":
        post = Posts.objects.create(
            title=request.POST.get("title"),
            content=request.POST.get("content"),
        )
        return post
    elif request.method == "DELETE":
        post = Posts.objects.get(id=request.GET.get("id"))
        if post is None:
            return HttpResponse(status=404, content="Not Found")
        post.delete()
        return HttpResponse(status=200, content="Deleted")


@http.require_http_methods(["GET"])
def feed(request):
    posts = Posts.objects.all().order_by("-created_at")
    return posts
