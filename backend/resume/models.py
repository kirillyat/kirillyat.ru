from django.db import models
from django.utils.text import slugify
import markdown

# Create your models here.


class Activity(models.Model):
    TYPE_CHOICES = [
        ("education", "Education"),
        ("experience", "Experience"),
        ("project", "Project"),
        ("certification", "Certification"),
    ]

    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    name = models.CharField(max_length=255)
    description = models.TextField()
    from_date = models.DateField()
    to_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    image = models.ImageField(upload_to="resume_images/", null=True, blank=True)
    url = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Activities"
        ordering = ["-from_date"]

    def __str__(self):
        return f"{self.name} ({self.type})"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("programming", "Programming Languages"),
        ("framework", "Frameworks & Libraries"),
        ("database", "Databases"),
        ("tool", "Tools & Technologies"),
        ("language", "Languages"),
        ("soft", "Soft Skills"),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(default=0)  # 0-100

    class Meta:
        ordering = ["category", "-proficiency"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class LectureFolder(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Lecture Folders"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return f"/lectures/folder/{self.slug}/"


class Lecture(models.Model):
    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("ru", "Russian"),
        ("es", "Spanish"),
        ("fr", "French"),
        ("de", "German"),
        ("zh", "Chinese"),
        ("ja", "Japanese"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="en")
    folder = models.ForeignKey(
        LectureFolder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lectures",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [["slug", "language"]]

    def __str__(self):
        return f"{self.title} ({self.get_language_display()})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_html_content(self):
        # Use markdown with extended features including mermaid support
        html_content = markdown.markdown(
            self.content, extensions=["extra", "codehilite", "fenced_code", "tables"]
        )

        # Process mermaid diagrams
        # Replace ```mermaid ... ``` blocks with proper div elements for mermaid.js
        import re

        pattern = r'<pre><code class="language-mermaid">(.*?)</code></pre>'
        replacement = r'<div class="mermaid">\1</div>'
        html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)

        return html_content

    def get_absolute_url(self):
        return f"/lectures/{self.slug}/"


class MentoringSession(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("booked", "Booked"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="available"
    )
    student_name = models.CharField(max_length=255, blank=True, null=True)
    student_email = models.EmailField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["date", "start_time"]

    def __str__(self):
        return f"{self.title} - {self.date} {self.start_time}"
