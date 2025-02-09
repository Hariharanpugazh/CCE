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
import traceback
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64
from rest_framework import status

# Create your views here.
JWT_SECRET = "secret"
JWT_ALGORITHM = "HS256"


def generate_tokens(student_user):
    access_payload = {
        "student_user": str(student_user),
        "exp": (datetime.utcnow() + timedelta(minutes=600)).timestamp(),  # Expiration in 600 minutes
        "iat": datetime.utcnow().timestamp(),  # Issued at current time
    }
    token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"jwt": token}


# MongoDB connection
client = MongoClient("mongodb+srv://ihub:ihub@cce.ksniz.mongodb.net/")
db = client["CCE"]
student_collection = db["students"]
admin_collection = db["admin"]
contactus_collection = db["contact_us"]
achievement_collection = db['student_achievement']

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
# Function to send confirmation email
def send_confirmation_email(to_email, name, password):
    subject = "Student Account Created"
    body = f"""
    Your Student account has been successfully created on the CCE platform.
    Username: {name}
    Password: {password}
    Please keep your credentials safe and secure.
    """

    msg = MIMEMultipart()
    msg['From'] = settings.EMAIL_HOST_USER
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to the Gmail SMTP server
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.starttls()  # Secure the connection
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)  # Login with credentials
        text = msg.as_string()
        server.sendmail(settings.EMAIL_HOST_USER, to_email, text)  # Send the email
        server.quit()  # Close the connection
        print(f"Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"Error sending email: {str(e)}")

@csrf_exempt
def student_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            department = data.get("department")
            year = data.get("year")
            college_name = data.get("college_name")
            password = data.get("password")

            # Check if the email already exists
            if student_collection.find_one({"email": email}):
                return JsonResponse(
                    {"error": "Student user with this email already exists"}, status=400
                )

            # Check if email is a valid college email ID
            if "@sns" not in email:
                return JsonResponse(
                    {"error": "Please enter a valid college email ID"}, status=400
                )

            # Check if the password is strong
            is_valid, error_message = is_strong_password(password)
            if not is_valid:
                return JsonResponse({"error": error_message}, status=400)

            # Hash the password
            hashed_password = make_password(password)

            # Create the student user document
            student_user = {
                "name": name,
                "department": department,
                "year": year,
                "college_name": college_name,
                "email": email,
                "password": hashed_password,
                "status": "active",  # Default status
                "last_login": None,  # No login yet
                "created_at": datetime.utcnow(),  # Account creation timestamp
            }

            # Insert the document into the collection
            student_collection.insert_one(student_user)

            # Send confirmation email with username and password
            send_confirmation_email(email, name, password)

            return JsonResponse(
                {"message": "Student user created successfully, confirmation email sent."}, status=201
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
                if lockout_data["count"] >= 3 and datetime.now() < lockout_data["lockout_until"]:
                    return JsonResponse(
                        {"error": "Too many failed attempts. Please try again after 2 minutes."},
                        status=403,
                    )

            # Find the student user by email
            student_user = student_collection.find_one({"email": email})
            if not student_user:
                return JsonResponse(
                    {"error": "No account found with this email"}, status=404
                )

            # Check if the account is active
            if student_user.get("status") != "active":
                return JsonResponse(
                    {"error": "This account is inactive. Please contact the admin."}, status=403
                )

            # Check the password
            if check_password(password, student_user["password"]):
                # Clear failed attempts after successful login
                failed_login_attempts.pop(email, None)

                # Update last login timestamp
                student_collection.update_one(
                    {"email": email}, {"$set": {"last_login": datetime.utcnow()}}
                )

                # Generate JWT token
                student_id = student_user.get("_id")
                tokens = generate_tokens(student_id)
                return JsonResponse({"message": "Login successful", "token": tokens}, status=200)
            else:
                # Track failed attempts
                if email not in failed_login_attempts:
                    failed_login_attempts[email] = {"count": 1, "lockout_until": None}
                else:
                    failed_login_attempts[email]["count"] += 1
                    if failed_login_attempts[email]["count"] >= 3:
                        failed_login_attempts[email]["lockout_until"] = datetime.now() + lockout_duration

                return JsonResponse({"error": "Invalid email or password."}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

def generate_reset_token(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@api_view(["POST"])
@permission_classes([AllowAny])
def student_forgot_password(request):
    try:
        email = request.data.get('email')
        user = student_collection.find_one({"email": email})
        if not user:
            return Response({"error": "Email not found"}, status=400)

        reset_token = generate_reset_token()
        expiration_time = datetime.utcnow() + timedelta(hours=1)

        student_collection.update_one(
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

@csrf_exempt
def student_reset_password(request):
    """Reset Password for Students"""
    if request.method == 'POST':
        try:
            # Parse the request payload
            data = json.loads(request.body)
            email = data.get('email')
            token = data.get('token')
            new_password = data.get('newPassword')

            # Validate the request data
            if not email or not token or not new_password:
                return JsonResponse({"error": "Email, token, and new password are required."}, status=400)

            # Fetch the user by email
            user = student_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # Validate the token and expiration
            if user.get("password_reset_token") != token:
                return JsonResponse({"error": "Invalid password reset token."}, status=403)

            if user.get("password_reset_expires") and datetime.utcnow() > user["password_reset_expires"]:
                return JsonResponse({"error": "Password reset token has expired."}, status=403)

            # Hash the new password
            hashed_password = make_password(new_password)

            # Update the password in MongoDB
            result = student_collection.update_one(
                {"email": email},
                {"$set": {
                    "password": hashed_password,
                    "password_reset_token": None,  # Clear reset token
                    "password_reset_expires": None  # Clear expiration time
                }}
            )

            if result.modified_count == 0:
                return JsonResponse({"error": "Failed to update the password in MongoDB."}, status=500)

            return JsonResponse({"message": "Password reset successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)
    
@csrf_exempt
def get_students(request):
    """
    API to retrieve all students.
    """
    if request.method == 'GET':
        try:
            students = student_collection.find()
            student_list = []
            for student in students:
                student['_id'] = str(student['_id'])  # Convert ObjectId to string
                del student['password']  # Don't expose passwords
                student_list.append(student)

            return JsonResponse({'students': student_list}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def update_student(request, student_id):
    """
    API to update a student's profile.
    """
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            student = student_collection.find_one({'_id': ObjectId(student_id)})
            if not student:
                return JsonResponse({'error': 'Student not found'}, status=404)

            # Define allowed fields for updating
            allowed_fields = ['name', 'department', 'year', 'email']

            # Filter data to include only allowed fields
            update_data = {field: data[field] for field in allowed_fields if field in data}

            if update_data:
                # Update student in MongoDB
                student_collection.update_one({'_id': ObjectId(student_id)}, {'$set': update_data})
                return JsonResponse({'message': 'Student details updated successfully'}, status=200)
            else:
                return JsonResponse({'error': 'No valid fields provided for update'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def delete_student(request, student_id):
    """
    API to delete a student.
    """
    if request.method == 'DELETE':
        try:
            student = student_collection.find_one({'_id': ObjectId(student_id)})
            if not student:
                return JsonResponse({'error': 'Student not found'}, status=404)

            # Delete student from MongoDB
            student_collection.delete_one({'_id': ObjectId(student_id)})

            return JsonResponse({'message': 'Student deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

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

            # Check if both name and email exist in the students collection
            student_data = student_collection.find_one({"email": contact})

            if not student_data:
                return JsonResponse({"error": "Email do not match any student records. Use your official Email"}, status=404)

            # Save contact message in the contact_us collection
            contact_document = {
                "name": name,
                "contact": contact,
                "message": message,
                "timestamp": datetime.now(timezone.utc)
            }
            contactus_collection.insert_one(contact_document)

            # Send email notification to admin
            subject = "Message From Student"
            email_message = (
                f"New message from {name}\n\n"
                f"Contact: {contact}\n\n"
                f"Message:\n{message}\n\n"
            )

            send_mail(
                subject,
                email_message,
                settings.EMAIL_HOST_USER,  # Sender email
                [settings.ADMIN_EMAIL],  # Admin email recipient
                fail_silently=False,
            )

            return JsonResponse({
                "message": "Your message has been received and sent to Admin!",
                "is_student": True
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def get_contact_messages(request):
    if request.method == "GET":
        try:
            # Fetch all messages from the contact_us collection
            messages = list(contactus_collection.find({}, {"_id": 0, "name": 1, "contact": 1, "message": 1, "timestamp": 1}))

            # Format timestamp for easier readability
            for message in messages:
                if "timestamp" in message and message["timestamp"]:
                    message["timestamp"] = message["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
                else:
                    message["timestamp"] = "N/A"

            return JsonResponse({"messages": messages}, status=200)

        except Exception as e:
            # Log the error and return a 500 response
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)

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
    
# ===================== ACHIEVEMENTS =====================

@csrf_exempt
@api_view(['POST'])
def post_student_achievement(request):
    """
    Handles submission of student achievements with file uploads.
    """
    # Extract and validate the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "No token provided"}, status=401)

    token = auth_header.split(" ")[1]

    try:
        # Decode the JWT token
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            leeway=timedelta(seconds=300)  # Allow 5 minutes of clock skew
        )
        student_id = payload.get('student_user')
        if not student_id:
            return JsonResponse({"error": "Invalid token"}, status=401)

        # Handle form data (multipart/form-data)
        name = request.POST.get("name")
        achievement_description = request.POST.get("achievement_description")
        achievement_type = request.POST.get("achievement_type")
        company_name = request.POST.get("company_name")
        date_of_achievement = request.POST.get("date_of_achievement")
        batch = request.POST.get("batch")

        # Validate required fields
        required_fields = [
            "name", "achievement_description", "achievement_type",
            "company_name", "date_of_achievement", "batch"
        ]
        for field in required_fields:
            if not locals().get(field):
                return JsonResponse(
                    {"error": f"{field.replace('_', ' ').capitalize()} is required."},
                    status=400
                )

        # Handle file upload
        file_base64 = None
        if "photo" in request.FILES:
            photo = request.FILES["photo"]
            file_base64 = base64.b64encode(photo.read()).decode("utf-8")

        # Prepare the document for MongoDB
        achievement_data = {
            "student_id": student_id,
            "name": name,
            "achievement_description": achievement_description,
            "achievement_type": achievement_type,
            "company_name": company_name,
            "date_of_achievement": date_of_achievement,
            "batch": batch,
            "photo": file_base64,  # Base64-encoded file (optional)
            "is_approved": False,  # Pending approval by default
            "submitted_at": datetime.utcnow(),
        }

        # Insert the document into MongoDB
        achievement_collection.insert_one(achievement_data)

        return JsonResponse(
            {"message": "Achievement submitted successfully. Please wait for approval."},
            status=201
        )

    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expired"}, status=401)
    except jwt.DecodeError:
        return JsonResponse({"error": "Invalid token"}, status=401)
    except Exception as e:
        # Log unexpected errors for debugging
        traceback.print_exc()
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)
