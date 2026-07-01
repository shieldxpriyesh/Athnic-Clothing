import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

def main():
    # 1. Run migrations
    print("Applying database migrations...")
    try:
        call_command('migrate', interactive=False)
        print("Database migrations applied successfully.")
    except Exception as e:
        print(f"Error applying migrations: {e}")

    # 2. Create superuser if it doesn't exist
    User = get_user_model()
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser '{username}'...")
        try:
            User.objects.create_superuser(username, email, password)
            print(f"Superuser '{username}' created successfully.")
        except Exception as e:
            print(f"Error creating superuser: {e}")
    else:
        print(f"Superuser '{username}' already exists.")

if __name__ == '__main__':
    main()
