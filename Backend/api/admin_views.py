import jwt
import json
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from pymongo import MongoClient
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import re  # Add this import for regex

# Create your views here.
JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'

def generate_tokens(admin_user):
    """
    Generate tokens for authentication. Modify this with JWT implementation if needed.
    """
    access_payload = {
        'admin_user': str(admin_user),
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow(),
    }

    # Encode the token
    token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {'jwt': token}

# MongoDB connection
client = MongoClient('mongodb+srv://ajaysihub:WhMxy4vtS6X8mWtT@atty.85tp6.mongodb.net/')
db = client['CCE']
admin_collection = db['admin']
internship_collection = db['internships']
job_collection = db['jobs']

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
            if admin_collection.find_one({'email': email}):
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
                'role': 'super_admin'
            }

            # Insert the document into the collection
            admin_collection.insert_one(super_admin_user)

            return JsonResponse({'message': 'Super admin user created successfully'}, status=201)
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
            super_admin_user = admin_collection.find_one({'email': email, 'role': 'super_admin'})
            super_admin_id = super_admin_user.get('_id')

            if super_admin_user and check_password(password, super_admin_user['password']):
                # Generate JWT token
                tokens = generate_tokens(super_admin_id)
                return JsonResponse({'message': 'Login successful', 'tokens': tokens}, status=200)
            else:
                return JsonResponse({'error': 'Invalid email or password'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
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
            
            admin_id = decoded_token['admin_id']  # Extract admin_id from decoded token
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
def get_internships(request):
    try:
        # Fetch approved internships
        internships = internship_collection.find({"publish": True})
        # Convert MongoDB cursor to list of dictionaries
        internship_list = []
        for internship in internships:
            internship['_id'] = str(internship['_id'])  # Convert ObjectId to string
            internship_list.append(internship)
        # Return the list of internships
        return JsonResponse({"internships": internship_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
#Jobs
@csrf_exempt
@api_view(['POST'])
def job_post(request):
    # For Django, access cookies using request.COOKIES
    auth_header = request.headers.get('Authorization')
    if not auth_header.startswith("Bearer "):
            return Response(
                {"error": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED
            )
    token = auth_header.split(" ")[1]
    print(token)
    if not token:
        return Response({"error": "JWT cookie not found"}, status=status.HTTP_401_UNAUTHORIZED)
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    user_id = payload.get('admin_user')
    print(user_id)
    try:
        data = json.loads(request.body)
        title = data.get('title')
        company_name = data.get('company_name')
        company_overview = data.get('company_overview')
        company_website = data.get('company_website')
        job_description = data.get('job_description')
        key_responsibilities = data.get('key_responsibilities')
        skills_required = data.get('required_skills')
        education_requirements = data.get('education_requirements')
        experience_level = data.get('experience_level')
        salary_range = data.get('salary_range')
        benefits = data.get('benefits')
        location = data.get('job_location')
        work_type = data.get('work_type')
        work_schedule = data.get('work_schedule')
        application_instructions = data.get('application_instructions')
        application_deadline = data.get('application_deadline')
        contact_email = data.get('contact_email')
        contact_phone = data.get('contact_phone')
        job_post = {
            "job_data": {
                "title": title,
                "company_name": company_name,
                "company_overview": company_overview,
                "company_website": company_website,
                "job_description": job_description,
                "key_responsibilities": key_responsibilities,
                "required_skills": skills_required,
                "education_requirements": education_requirements,
                "experience_level": experience_level,
                "salary_range": salary_range,
                "benefits": benefits,
                "job_location": location,
                "work_type": work_type,
                "work_schedule": work_schedule,
                "application_instructions": application_instructions,
                "application_deadline": application_deadline,
                "contact_email": contact_email,
                "contact_phone": contact_phone,
            },
            "user_id": user_id,
            "is_publish": False,
        }
        try:
            job_collection.insert_one(job_post)
            
        except Exception as e:
            return Response(
                {"error": "Database error occurred"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        return Response(
            {"message": "Job stored successfully, waiting for approval"}, 
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )