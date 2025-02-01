import jwt
import json
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from pymongo import MongoClient
from bson import ObjectId
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
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
        'exp': datetime.now() + timedelta(minutes=600),  # Access token expiration
        'iat': datetime.now(),
    }

    # Encode the token
    token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {'jwt': token}

# MongoDB connection
client = MongoClient('mongodb+srv://ajaysihub:WhMxy4vtS6X8mWtT@atty.85tp6.mongodb.net/')
db = client['CCE']
admin_collection = db['admin']
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

            return JsonResponse({'message': 'Admin user created successfully'}, status=201)
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


# function to approve or reject job request
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
