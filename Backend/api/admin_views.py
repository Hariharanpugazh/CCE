import jwt
import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from bson import ObjectId
from pymongo import MongoClient
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
import base64
import re  # Add this import for regex
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import random
import string

# Create your views here.
JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'

def generate_tokens(admin_user):
    """
    Generate tokens for authentication. Modify this with JWT implementation if needed.
    """
    access_payload = {
        'admin_user': str(admin_user),
        'role':'admin',
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow(),
    }

    # Encode the token
    token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {'jwt': token}

def generate_tokens_superadmin(superadmin_user):
    """
    Generate tokens for authentication. Modify this with JWT implementation if needed.
    """
    access_payload = {
        'superadmin_user': str(superadmin_user),
        'role':'superadmin',
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow(),
    }

    # Encode the token
    token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {'jwt': token}

# MongoDB connection
client = MongoClient('mongodb+srv://ihub:ihub@cce.ksniz.mongodb.net/')
db = client['CCE']
admin_collection = db['admin']
internship_collection = db['internships']
job_collection = db['jobs']
achievement_collection = db['achievement']
superadmin_collection = db['superadmin']

@csrf_exempt
def admin_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            # Check if the email contains "sns"
            if "@sns" not in email:
                return JsonResponse({'error': 'Email must contain domain id'}, status=400)

            # Check if the email already exists
            if admin_collection.find_one({'email': email}):
                return JsonResponse({'error': 'Admin user with this email already exists'}, status=400)

            # Check if the password is strong
            if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password):
                return JsonResponse({'error': 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character'}, status=400)

            # Hash the password
            password = make_password(password)

            # Create the admin user document
            admin_user = {
                'name': name,
                'email': email,
                'password': password
            }

            # Insert the document into the collection
            admin_collection.insert_one(admin_user)

            return JsonResponse({'message': 'Admin user created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Check if the email contains "sns"
            if "@sns" not in email:
                return JsonResponse({'error': 'Email must contain domain id'}, status=400)

            # Find the admin user by email
            admin_user = admin_collection.find_one({'email': email})
            admin_id = admin_user.get('_id')

            if admin_user and check_password(password, admin_user['password']):
                # Generate JWT token
                tokens = generate_tokens(admin_id)
                return JsonResponse({'message': 'Login successful', 'tokens': tokens}, status=200)
            else:
                return JsonResponse({'error': 'Invalid email or password'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
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



@csrf_exempt
def super_admin_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            # Check if the email contains "sns"
            if "@sns" not in email:
                return JsonResponse({'error': 'Email must contain domain id'}, status=400)

            # Check if the email already exists
            if superadmin_collection.find_one({'email': email}):
                return JsonResponse({'error': 'Super admin user with this email already exists'}, status=400)

            # Check if the password is strong
            if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password):
                return JsonResponse({'error': 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character'}, status=400)

            # Hash the password
            password = make_password(password)

            # Create the super admin user document
            super_admin_user = {
                'name': name,
                'email': email,
                'password': password,
            }

            # Insert the document into the collection
            superadmin_collection.insert_one(super_admin_user)

            return JsonResponse({'message': 'Super admin user created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def super_admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Check if the email contains "sns"
            if "@sns" not in email:
                return JsonResponse({'error': 'Email must contain domain id'}, status=400)

            # Find the super admin user by email
            super_admin_user = superadmin_collection.find_one({'email': email})
            super_admin_id = super_admin_user.get('_id')

            if super_admin_user and check_password(password, super_admin_user['password']):
                # Generate JWT token
                tokens = generate_tokens_superadmin(super_admin_id)
                return JsonResponse({'message': 'Login successful', 'tokens': tokens}, status=200)
            else:
                return JsonResponse({'error': 'Invalid email or password'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
# ============================================================== JOBS ======================================================================================

@csrf_exempt
@api_view(['POST'])
def job_post(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(" ")[1]
    try:
        # Decode the JWT token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin_id = payload.get('admin_user')  # Extract admin_id from token
        if not admin_id:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        data = json.loads(request.body)
        # Prepare job data
        job_post = {
            "job_data": {
                "title": data.get('title'),
                "company_name": data.get('company_name'),
                "company_overview": data.get('company_overview'),
                "company_website": data.get('company_website'),
                "job_description": data.get('job_description'),
                "key_responsibilities": data.get('key_responsibilities'),
                "required_skills": data.get('required_skills'),
                "education_requirements": data.get('education_requirements'),
                "experience_level": data.get('experience_level'),
                "salary_range": data.get('salary_range'),
                "benefits": data.get('benefits'),
                "job_location": data.get('job_location'),
                "work_type": data.get('work_type'),
                "work_schedule": data.get('work_schedule'),
                "application_instructions": data.get('application_instructions'),
                "application_deadline": data.get('application_deadline'),
                "contact_email": data.get('contact_email'),
                "contact_phone": data.get('contact_phone'),
            },
            "user_id": admin_id,  # Save the admin_id from the token
            "is_publish": False,
            "updated_at": datetime.now()
        }
        # Insert the job post into the database
        job_collection.insert_one(job_post)
        return Response({"message": "Job stored successfully, waiting for approval"}, status=status.HTTP_201_CREATED)
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def get_jobs(request):
    try:
        jobs = job_collection.find()
        job_list = []
        for job in jobs:
            job["_id"] = str(job["_id"])  # Convert ObjectId to string
            job_list.append(job)
        return JsonResponse({"jobs": job_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    
@csrf_exempt
def review_job(request, job_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            action = data.get("action")
            if action not in ["approve", "reject"]:
                return JsonResponse({"error": "Invalid action"}, status=400)
            job = job_collection.find_one({"_id": ObjectId(job_id)})
            if not job:
                return JsonResponse({"error": "Job not found"}, status=404)
            if action == "approve":
                job_collection.update_one(
                    {"_id": ObjectId(job_id)},
                    {
                        "$set": {
                            "is_publish": True,
                            "updated_at": datetime.now(),
                        }
                    },
                )
                return JsonResponse(
                    {"message": "Job approved and published successfully"}, status=200
                )
            elif action == "reject":
                job_collection.update_one(
                    {"_id": ObjectId(job_id)},
                    {
                        "$set": {
                            "is_publish": False,
                            "updated_at": datetime.now(),
                        }
                    },
                )
                return JsonResponse(
                    {"message": "Job rejected successfully"}, status=200
                )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
    
@csrf_exempt
def get_published_jobs(request):
    """
    Fetch all jobs with is_publish set to True.
    """
    try:
        published_jobs = job_collection.find({"is_publish": True})
        job_list = []
        for job in published_jobs:
            job["_id"] = str(job["_id"])  # Convert ObjectId to string
            job_list.append(job)
        return JsonResponse({"jobs": job_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
def get_job_by_id(request, job_id):
    """
    Fetch a single job by its ID.
    """
    try:
        job = job_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            return JsonResponse({"error": "Job not found"}, status=404)

        job["_id"] = str(job["_id"])  # Convert ObjectId to string
        return JsonResponse({"job": job}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ============================================================== ACHIEVEMENTS ======================================================================================

@csrf_exempt
@api_view(['POST'])
def post_achievement(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(" ")[1]
    try:
        # Decode the JWT token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin_id = payload.get('admin_user')  # Extract admin_id from token
        if not admin_id:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

        # Get text data from request
        name = request.POST.get("name")
        department = request.POST.get("department")
        achievement = request.POST.get("achievement")
        batch = request.POST.get("batch")

        # Check if an image was uploaded
        if "photo" in request.FILES:
            image_file = request.FILES["photo"]
            # Convert the image to base64
            image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
        else:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare the document to insert
        achievement_data = {
            "name": name,
            "department": department,
            "achievement": achievement,
            "batch": batch,
            "photo": image_base64,  # Store as base64
            "user_id": admin_id,  # Save the admin_id from the token
            "is_publish": False,  # Initially false, waiting for approval
            "updated_at": datetime.now()
        }

        # Insert into MongoDB
        achievement_collection.insert_one(achievement_data)

        return Response({"message": "Achievement stored successfully, waiting for approval"}, status=status.HTTP_201_CREATED)

    except jwt.ExpiredSignatureError:
        return Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def get_achievements(request):
    try:
        achievements = achievement_collection.find()
        achievement_list = [
            {**achievement, "_id": str(achievement["_id"])}  # Convert ObjectId to string
            for achievement in achievements
        ]
        return JsonResponse({"achievements": achievement_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def review_achievement(request, achievement_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            action = data.get("action")
            if action not in ["approve", "reject"]:
                return JsonResponse({"error": "Invalid action"}, status=400)

            achievement = achievement_collection.find_one({"_id": ObjectId(achievement_id)})
            if not achievement:
                return JsonResponse({"error": "Achievement not found"}, status=404)

            is_publish = True if action == "approve" else False
            achievement_collection.update_one(
                {"_id": ObjectId(achievement_id)},
                {"$set": {"is_publish": is_publish, "updated_at": datetime.now()}}
            )

            message = "Achievement approved and published successfully" if is_publish else "Achievement rejected successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def get_published_achievements(request):
    try:
        published_achievements = achievement_collection.find({"is_publish": True})
        achievement_list = [
            {**achievement, "_id": str(achievement["_id"])}  # Convert ObjectId to string
            for achievement in published_achievements
        ]
        return JsonResponse({"achievements": achievement_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
# ============================================================== INTERNSHIP ======================================================================================

@csrf_exempt
def post_internship(request):
    if request.method == 'POST':
        try:
            # Get JWT token from cookies
            jwt_token = request.COOKIES.get("jwt")
            if not jwt_token:
                raise AuthenticationFailed("Authentication credentials were not provided.")
        
            # Decode JWT token
            try:
                decoded_token = jwt.decode(jwt_token, 'secret', algorithms=["HS256"]) 
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed("Access token has expired. Please log in again.")
            except jwt.InvalidTokenError:
                raise AuthenticationFailed("Invalid token. Please log in again.")
            
            admin_id = decoded_token['admin_user']  # Extract admin_id from decoded token
            # Parse incoming data
            data = json.loads(request.body)
            # Ensure required fields are provided in the data
            required_fields = ['title', 'company_name', 'location', 'duration', 'stipend', 'application_deadline', 'skills_required', 'job_description', 'company_website', 'internship_type']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({"error": f"Missing required field: {field}"}, status=400)
            # Convert application_deadline to datetime
            try:
                application_deadline = datetime.strptime(data['application_deadline'], "%Y-%m-%d")
            except ValueError:
                return JsonResponse({"error": "Invalid date format for application_deadline. Use YYYY-MM-DD."}, status=400)
            # Prepare internship data for storage
            internship_data = {
                "title": data["title"],
                "company_name": data["company_name"],
                "location": data["location"],
                "duration": data["duration"],
                "stipend": data["stipend"],
                "application_deadline": application_deadline,
                "skills_required": data["skills_required"],
                "job_description": data["job_description"],
                "company_website": data["company_website"],
                "admin_id": admin_id,
                "internship_type": data["internship_type"],
                "publish": False,  # Internship initially unpublished
            }
            # Insert into MongoDB
            internship_collection.insert_one(internship_data)
            # Return success response
            return JsonResponse({"message": "Internship posted successfully, awaiting approval."}, status=200)
        except AuthenticationFailed as auth_error:
            return JsonResponse({"error": str(auth_error)}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)

@csrf_exempt
def get_published_internships(request):
    try:
        published_internships = internship_collection.find({"publish": True})
        internship_list = [
            {**internship, "_id": str(internship["_id"])}  # Convert ObjectId to string
            for internship in published_internships
        ]
        return JsonResponse({"internships": internship_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def review_internship(request, internship_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            action = data.get("action")
            if action not in ["approve", "reject"]:
                return JsonResponse({"error": "Invalid action"}, status=400)

            internship = internship_collection.find_one({"_id": ObjectId(internship_id)})
            if not internship:
                return JsonResponse({"error": "Internship not found"}, status=404)

            is_publish = True if action == "approve" else False
            internship_collection.update_one(
                {"_id": ObjectId(internship_id)},
                {"$set": {"publish": is_publish, "updated_at": datetime.now()}}
            )

            message = "Internship approved and published successfully" if is_publish else "Internship rejected successfully"
            return JsonResponse({"message": message}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def get_internships(request):
    try:
        internships = internship_collection.find()
        internship_list = [
            {**internship, "_id": str(internship["_id"])}  # Convert ObjectId to string
            for internship in internships
        ]
        return JsonResponse({"internships": internship_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

