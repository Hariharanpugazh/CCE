import jwt
import json
import re
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from pymongo import MongoClient
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from bson import ObjectId
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import random
import string

# Create your views here.
JWT_SECRET = "secret"
JWT_ALGORITHM = "HS256"


def generate_tokens(student_user):
    """
    Generate tokens for authentication. Modify this with JWT implementation if needed.
    """
    access_payload = {
        "student_user": str(student_user),
        "exp": datetime.now() + timedelta(minutes=600),  # Access token expiration
        "iat": datetime.now(),
    }

    # Encode the token
    token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"jwt": token}


# MongoDB connection
client = MongoClient("mongodb+srv://ihub:ihub@cce.ksniz.mongodb.net/")
db = client["CCE"]
student_collection = db["students"]
admin_collection = db["admin"]
contactus_collection = db["contact_us"]

# Dictionary to track failed login attempts
failed_login_attempts = {}
lockout_duration = timedelta(minutes=2)  # Time to lock out after 3 failed attempts

# function to check if password is strong
def is_strong_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must include at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must include at least one lowercase letter."
    if not re.search(r"[0-9]", password):
        return False, "Password must include at least one digit."
    if not re.search(r"[@$!%*?&#]", password):
        return False, "Password must include at least one special character."
    return True, ""


@csrf_exempt
def student_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            department = data.get("department")
            year = data.get("year")
            password =data.get("password")

            # Check if the email already exists
            if student_collection.find_one({"email": email}):
                return JsonResponse(
                    {"error": "Student user with this email already exists"}, status=400
                )
                
            #check email is college email id
            if "@sns" not in  email:
                return JsonResponse(
                    {"error": "Please enter a valid college email id"}, status=400 
                )
            
            # Check if the password is strong
            is_valid, error_message = is_strong_password(password)
            if not is_valid:
                return JsonResponse({"error": error_message}, status=400)

            # Hash the password
            hashed_password = make_password(password)

            # Create the student user document
            student_user = {"name": name,"department": department, "year": year, "email": email, "password": hashed_password}

            # Insert the document into the collection
            student_collection.insert_one(student_user)

            return JsonResponse(
                {"message": "Student user created successfully"}, status=201
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def student_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # Check lockout status
            if email in failed_login_attempts:
                lockout_data = failed_login_attempts[email]
                if lockout_data['count'] >= 3 and datetime.now() < lockout_data['lockout_until']:
                    return JsonResponse({'error': 'Too many failed attempts. Please try again later.'}, status=403)

            # Find the student user by email
            student_user = student_collection.find_one({"email": email})
            if not student_user:
                return JsonResponse({"error": "Student user with this email does not exist"}, status=404)

            if check_password(password, student_user["password"]):
                # Clear failed attempts after successful login
                failed_login_attempts.pop(email, None)

                # Generate JWT token
                student_id = student_user.get("_id")
                tokens = generate_tokens(student_id)
                return JsonResponse({"message": "Login successful", "token": tokens}, status=200)
            else:
                # Track failed attempts
                if email not in failed_login_attempts:
                    failed_login_attempts[email] = {'count': 1, 'lockout_until': None}
                else:
                    failed_login_attempts[email]['count'] += 1
                    if failed_login_attempts[email]['count'] >= 3:
                        failed_login_attempts[email]['lockout_until'] = datetime.now() + lockout_duration

                return JsonResponse({"error": "Invalid password"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

    
# ===================== CONTACT US =====================

@csrf_exempt
def contact_us(request):
    if request.method == "POST":
        try:
            # Parse JSON request body
            data = json.loads(request.body)
            name = data.get("name")
            contact = data.get("contact")
            message = data.get("message")

            # Validate input fields
            if any(not field for field in [name, contact, message]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            # Send email notification to admin
            subject = "New Contact Us Message"
            email_message = f"New message from {name}\n\nContact: {contact}\n\nMessage:\n{message}"

            send_mail(
                subject,
                email_message,
                settings.EMAIL_HOST_USER,  # Sender email
                [settings.ADMIN_EMAIL],  # Admin email recipient
                fail_silently=False,
            )

            return JsonResponse({"message": "Your message has been received and sent to admin!"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    

@csrf_exempt
def get_profile(request, userId):
    if request.method == "GET":
        try:
            # Find the student user by id
            user = student_collection.find_one({"_id": ObjectId(userId)}) 
            
            if not user:
                user = admin_collection.find_one({"_id": ObjectId(userId)})
                user['source'] = 'admin' if user else None 
            else:
                user['source'] = 'student'

            if not user:
                return JsonResponse(
                    {"error": "User with this id does not exist"}, status=400
                )     
            
            if user.get('source') == 'student':
                # Handle student user
                data = {
                    "name": user.get("name"),
                    "email": user.get("email"),
                    "department": user.get("department"),
                    "year": user.get("year"),
                    "role": "student",
                }
                return JsonResponse(
                    {"message": "Student user found", "data": data}, status=200
                )
            elif user.get('source') == 'admin':
                # Handle admin user
                data = {
                    "name": user.get("name"),
                    "email": user.get("email"),
                    "department": user.get("department"),
                    "role": "admin",
                }
                return JsonResponse(
                    {"message": "Admin user found", "data":data}, status=200
                )
            
            else:
                return JsonResponse(
                    {"error": "User source not found"}, status=400
                )
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
    
def generate_reset_token(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):
    try:
        email = request.data.get('email')
        user = admin_collection.find_one({"email": email})
        if not user:
            return Response({"error": "Email not found"}, status=400)

        reset_token = generate_reset_token()
        expiration_time = datetime.utcnow() + timedelta(hours=1)

        admin_collection.update_one(
            {"email": email},
            {"$set": {"password_reset_token": reset_token, "password_reset_expires": expiration_time}}
        )

        send_mail(
            'Password Reset Request',
            f'Use this token to reset your password: {reset_token}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )

        return Response({"message": "Password reset token sent to your email"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

from django.contrib.auth.hashers import make_password


@csrf_exempt
def reset_password(request):
    """Handle password reset"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            new_password = data.get('newPassword')

            if not email or not new_password:
                return JsonResponse({"error": "Email and new password are required."}, status=400)

            # Hash the new password using Django's built-in make_password
            hashed_password = make_password(new_password)

            # Update the password in the database with the hashed password
            result = admin_collection.update_one(
                {"email": email},
                {"$set": {"password": hashed_password}}
            )

            if result.modified_count == 0:
                return JsonResponse({"error": "User not found."}, status=404)

            return JsonResponse({"message": "Password reset successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)