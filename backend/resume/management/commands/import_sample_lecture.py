import os
from django.core.management.base import BaseCommand
from resume.models import Lecture
from django.utils.text import slugify


class Command(BaseCommand):
    help = "Import a sample lecture from a markdown file"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str, help="Path to the markdown file")

    def handle(self, *args, **options):
        file_path = options["file_path"]

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        try:
            with open(file_path, "r") as file:
                content = file.read()

                # Extract title from the first line (assuming it's a # heading)
                lines = content.split("\n")
                title = (
                    lines[0].replace("# ", "")
                    if lines[0].startswith("# ")
                    else "Sample Lecture"
                )

                # Create or update the lecture
                lecture, created = Lecture.objects.update_or_create(
                    slug=slugify(title),
                    defaults={"title": title, "content": content, "published": True},
                )

                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully created lecture: {title}")
                    )
                else:
                    self.stdout.write(
                        self.style.SUCCESS(f"Successfully updated lecture: {title}")
                    )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error importing lecture: {str(e)}"))
