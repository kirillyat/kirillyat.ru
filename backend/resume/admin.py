from django.contrib import admin
from .models import Activity, Skill, Lecture, MentoringSession, LectureFolder


# Register your models here.
@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "from_date", "to_date", "current")
    list_filter = ("type", "current")
    search_fields = ("name", "description")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "proficiency")
    list_filter = ("category",)
    search_fields = ("name",)


@admin.register(LectureFolder)
class LectureFolderAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent")
    list_filter = ("parent",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "language",
        "folder",
        "slug",
        "created_at",
        "updated_at",
        "published",
    )
    list_filter = ("published", "language", "folder")
    search_fields = ("title", "content")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("published", "language", "folder")


@admin.register(MentoringSession)
class MentoringSessionAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "start_time", "end_time", "status")
    list_filter = ("status", "date")
    search_fields = ("title", "description", "student_name")
