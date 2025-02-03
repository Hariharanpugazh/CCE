from django.urls import path
from .views import *
from .admin_views import *

urlpatterns = [
    #admin
    path("signup/", admin_signup, name="admin_signup"),
    path("login/", admin_login, name="admin_login"),
    path("internship/post/", post_internship, name="post_internship"),
    path('internship/', get_internships, name='get_internships'),
    path("job_post/", job_post, name="job_post"),
    path("upload_achievement/",post_achievement,name="upload_acheivement"),

    #superadmin
    path("superadmin_signup/",super_admin_signup,name= "super_admin_signup"),
    path("superadmin_login/",super_admin_login,name="super_admin_login"),
<<<<<<< HEAD
    path("upload_achievement/",post_achievement,name="upload_acheivement"),
=======
    path("review-job/<str:job_id>/", review_job, name="approve_job"),

    
    #student
    path("stud/signup/", student_signup, name="student_signup"),
    path("stud/login/", student_login, name="student_login"),

>>>>>>> 1677d6ed569ebedc7c46f471e4355dd36c884ead
]