from django.urls import path
from .views import *
from .admin_views import *

urlpatterns = [
    #admin
    path("signup/", admin_signup, name="admin_signup"),
    path("login/", admin_login, name="admin_login"),

    #superadmin
    path("superadmin_signup/",super_admin_signup,name= "super_admin_signup"),
    path("superadmin_login/",super_admin_login,name="super_admin_login"),

    
    #student
    path("stud/signup/", student_signup, name="student_signup"),
    path("stud/login/", student_login, name="student_login"),

]