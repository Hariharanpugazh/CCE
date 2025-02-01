import jwt
import json
import re
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from pymongo import MongoClient
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt

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
client = MongoClient("mongodb+srv://ajaysihub:WhMxy4vtS6X8mWtT@atty.85tp6.mongodb.net/")
db = client["CCE"]
student_collection = db["students"]

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

            # Find the student user by email
            student_user = student_collection.find_one({"email": email})

            if not student_user:
                return JsonResponse(
                    {"error": "Student user with this email does not exist"}, status=400
                )

            if not check_password(password, student_user["password"]):
                return JsonResponse(
                    {"error": "Invalid password"}, status=400  
                )

            # Generate JWT token
            student_id = student_user.get("_id")
            tokens = generate_tokens(student_id)
            return JsonResponse(
                {"message": "Login successful", "token": tokens}, status=200
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
