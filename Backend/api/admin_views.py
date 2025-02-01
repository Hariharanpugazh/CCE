import jwt
import json
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from pymongo import MongoClient
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
def admin_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = make_password(data.get('password'))

            # Check if the email already exists
            if admin_collection.find_one({'email': email}):
                return JsonResponse({'error': 'Admin user with this email already exists'}, status=400)

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