from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.views.decorators.http import require_http_methods
from .models import Activity, Skill, MentoringSession
import json
import os
import re
import markdown
from pathlib import Path
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

# Path to lectures directory
LECTURES_DIR = "/lectures"

# Ensure lectures directory exists
os.makedirs(LECTURES_DIR, exist_ok=True)


def get_folder_structure():
    """Get the folder structure of lectures directory"""
    folders = []

    # Get all directories in the lectures directory
    for item in os.listdir(LECTURES_DIR):
        item_path = os.path.join(LECTURES_DIR, item)
        if os.path.isdir(item_path) and not item.startswith("."):
            folder = {
                "id": len(folders) + 1,
                "name": item,
                "slug": item.lower().replace(" ", "-"),
                "description": "",
                "has_children": any(
                    os.path.isdir(os.path.join(item_path, child))
                    for child in os.listdir(item_path)
                ),
            }

            # Try to read description from README.md if it exists
            readme_path = os.path.join(item_path, "README.md")
            if os.path.exists(readme_path):
                with open(readme_path, "r") as f:
                    content = f.read()
                    # Extract first paragraph as description
                    match = re.search(
                        r"^#\s+(.+?)\n+(.+?)(?:\n\n|\n#|$)", content, re.DOTALL
                    )
                    if match:
                        folder["description"] = match.group(2).strip()

            folders.append(folder)

    return folders


def get_lectures_in_folder(folder_slug=None, language="en"):
    """Get all lectures in a folder"""
    lectures = []

    if folder_slug:
        # Find the folder path
        folder_path = None
        for item in os.listdir(LECTURES_DIR):
            if item.lower().replace(" ", "-") == folder_slug:
                folder_path = os.path.join(LECTURES_DIR, item)
                break

        if not folder_path or not os.path.isdir(folder_path):
            return []

        base_path = folder_path
    else:
        base_path = LECTURES_DIR

    # Get all markdown files in the folder
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".md") and not file == "README.md":
                file_path = os.path.join(root, file)

                # Check if the file is in the requested language
                file_lang = "en"  # Default language

                # Extract language from filename (e.g., lecture.ru.md)
                lang_match = re.search(r"\.([a-z]{2})\.md$", file)
                if lang_match:
                    file_lang = lang_match.group(1)

                if language != "all" and file_lang != language:
                    continue

                with open(file_path, "r") as f:
                    content = f.read()

                # Extract title from the first heading
                title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
                title = (
                    title_match.group(1) if title_match else os.path.splitext(file)[0]
                )

                # Generate a slug from the filename
                slug = os.path.splitext(file)[0].lower().replace(" ", "-")
                if lang_match:
                    slug = slug.replace("." + file_lang, "")

                # Get relative folder path
                rel_folder_path = os.path.relpath(root, LECTURES_DIR)
                folder_name = os.path.basename(root) if rel_folder_path != "." else None
                folder_slug = (
                    folder_name.lower().replace(" ", "-") if folder_name else None
                )

                # Get file modification time
                mtime = os.path.getmtime(file_path)

                lectures.append(
                    {
                        "id": len(lectures) + 1,
                        "title": title,
                        "slug": slug,
                        "language": file_lang,
                        "language_display": file_lang.upper(),
                        "folder": folder_name,
                        "folder_slug": folder_slug,
                        "created_at": mtime,
                        "updated_at": mtime,
                    }
                )

    return lectures


def get_lecture_content(slug, language="en"):
    """Get the content of a specific lecture"""
    # Search for the lecture file
    for root, dirs, files in os.walk(LECTURES_DIR):
        for file in files:
            file_base = os.path.splitext(file)[0]

            # Check if it's a language-specific file
            lang_match = re.search(r"\.([a-z]{2})$", file_base)
            file_lang = lang_match.group(1) if lang_match else "en"
            file_base_no_lang = (
                file_base.replace("." + file_lang, "") if lang_match else file_base
            )

            if file_base_no_lang.lower().replace(" ", "-") == slug and file.endswith(
                ".md"
            ):
                if language == "all" or file_lang == language:
                    file_path = os.path.join(root, file)
                    with open(file_path, "r") as f:
                        content = f.read()

                    # Extract title from the first heading
                    title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
                    title = (
                        title_match.group(1)
                        if title_match
                        else os.path.splitext(file)[0]
                    )

                    # Get relative folder path
                    rel_folder_path = os.path.relpath(root, LECTURES_DIR)
                    folder_name = (
                        os.path.basename(root) if rel_folder_path != "." else None
                    )
                    folder_slug = (
                        folder_name.lower().replace(" ", "-") if folder_name else None
                    )

                    # Get file modification time
                    mtime = os.path.getmtime(file_path)

                    # Get available languages
                    available_languages = []
                    file_dir = os.path.dirname(file_path)
                    file_name_no_ext = os.path.splitext(file_base_no_lang)[0]

                    for other_file in os.listdir(file_dir):
                        if other_file.startswith(
                            file_name_no_ext
                        ) and other_file.endswith(".md"):
                            other_lang_match = re.search(
                                r"\.([a-z]{2})\.md$", other_file
                            )
                            if other_lang_match:
                                available_languages.append(other_lang_match.group(1))
                            elif other_file == file_name_no_ext + ".md":
                                available_languages.append("en")

                    # Process mermaid diagrams
                    html_content = markdown.markdown(
                        content,
                        extensions=["extra", "codehilite", "fenced_code", "tables"],
                    )

                    # Replace ```mermaid ... ``` blocks with proper div elements
                    # First, try with language-mermaid class
                    pattern1 = r'<pre><code class="language-mermaid">(.*?)</code></pre>'
                    replacement = r'<div class="mermaid">\1</div>'
                    html_content = re.sub(
                        pattern1, replacement, html_content, flags=re.DOTALL
                    )

                    # Also try with codehilite class which might be used instead
                    pattern2 = r'<div class="codehilite"><pre><span></span><code>(.*?)</code></pre></div>'
                    html_content = re.sub(
                        pattern2,
                        lambda m: (
                            f'<div class="mermaid">{m.group(1)}</div>'
                            if "graph TD" in m.group(1) or "graph LR" in m.group(1)
                            else m.group(0)
                        ),
                        html_content,
                        flags=re.DOTALL,
                    )

                    # Get next and previous lectures in the same folder
                    lectures_in_folder = get_lectures_in_folder(folder_slug, language)
                    current_index = -1

                    for i, lecture in enumerate(lectures_in_folder):
                        if lecture["slug"] == slug:
                            current_index = i
                            break

                    prev_lecture = (
                        lectures_in_folder[current_index - 1]
                        if current_index > 0
                        else None
                    )
                    next_lecture = (
                        lectures_in_folder[current_index + 1]
                        if current_index < len(lectures_in_folder) - 1
                        and current_index >= 0
                        else None
                    )

                    return {
                        "id": 1,  # Placeholder ID
                        "title": title,
                        "content": content,
                        "html_content": html_content,
                        "language": file_lang,
                        "language_display": file_lang.upper(),
                        "available_languages": available_languages,
                        "folder": folder_name,
                        "folder_slug": folder_slug,
                        "created_at": mtime,
                        "updated_at": mtime,
                        "prev_lecture": prev_lecture if prev_lecture else None,
                        "next_lecture": next_lecture if next_lecture else None,
                    }

    return None


def resume_data(request):
    """Return all resume data including activities and skills"""
    activities = Activity.objects.all()
    skills = Skill.objects.all()

    # Group activities by type
    activities_by_type = {}
    for activity in activities:
        if activity.type not in activities_by_type:
            activities_by_type[activity.type] = []

        activity_data = {
            "id": activity.id,
            "name": activity.name,
            "description": activity.description,
            "from_date": activity.from_date.isoformat(),
            "to_date": activity.to_date.isoformat() if activity.to_date else None,
            "current": activity.current,
            "url": activity.url,
            "image": activity.image.url if activity.image else None,
        }
        activities_by_type[activity.type].append(activity_data)

    # Group skills by category
    skills_by_category = {}
    for skill in skills:
        if skill.category not in skills_by_category:
            skills_by_category[skill.category] = []

        skill_data = {
            "id": skill.id,
            "name": skill.name,
            "proficiency": skill.proficiency,
        }
        skills_by_category[skill.category].append(skill_data)

    return JsonResponse(
        {
            "activities": activities_by_type,
            "skills": skills_by_category,
        }
    )


def folders_list(request):
    """Return a list of all lecture folders"""
    folders = get_folder_structure()
    return JsonResponse({"folders": folders})


def folder_detail(request, slug):
    """Return details of a specific folder including subfolders and lectures"""
    # Get language from query params, default to English
    language = request.GET.get("lang", "en")

    # Find the folder in our structure
    folders = get_folder_structure()
    folder = None

    for f in folders:
        if f["slug"] == slug:
            folder = f
            break

    if not folder:
        raise Http404("Folder not found")

    # Get lectures in this folder
    lectures = get_lectures_in_folder(slug, language)

    # Get subfolders (not implemented in this simplified version)
    subfolders = []

    folder_data = {
        "id": folder["id"],
        "name": folder["name"],
        "slug": folder["slug"],
        "description": folder["description"],
        "parent": None,  # Not implementing parent folders in this simplified version
        "subfolders": subfolders,
        "lectures": lectures,
    }

    return JsonResponse(folder_data)


def lectures_list(request):
    """Return a list of all lectures"""
    # Get language from query params, default to English
    language = request.GET.get("lang", "en")
    folder_slug = request.GET.get("folder", None)

    # Get lectures
    lectures = get_lectures_in_folder(folder_slug, language)

    return JsonResponse({"lectures": lectures})


def lecture_detail(request, slug):
    """Return the details of a specific lecture"""
    # Get language from query params, default to English
    language = request.GET.get("lang", "en")

    # Get lecture content
    lecture = get_lecture_content(slug, language)

    if not lecture:
        raise Http404("Lecture not found")

    return JsonResponse(lecture)


def mentoring_sessions(request):
    """Return a list of available mentoring sessions"""
    sessions = MentoringSession.objects.filter(status="available")

    sessions_data = []
    for session in sessions:
        sessions_data.append(
            {
                "id": session.id,
                "title": session.title,
                "description": session.description,
                "date": session.date.isoformat(),
                "start_time": session.start_time.isoformat(),
                "end_time": session.end_time.isoformat(),
            }
        )

    return JsonResponse({"sessions": sessions_data})


@csrf_exempt
@require_http_methods(["POST"])
def book_session(request, session_id):
    """Book a mentoring session"""
    try:
        session = get_object_or_404(MentoringSession, id=session_id, status="available")

        data = json.loads(request.body)
        student_name = data.get("student_name")
        student_email = data.get("student_email")

        if not student_name or not student_email:
            return JsonResponse({"error": "Name and email are required"}, status=400)

        session.student_name = student_name
        session.student_email = student_email
        session.status = "booked"
        session.save()

        return JsonResponse(
            {
                "success": True,
                "message": "Session booked successfully",
                "session_id": session.id,
            }
        )
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
