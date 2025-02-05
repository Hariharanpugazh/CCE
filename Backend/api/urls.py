from django.urls import path
from .views import *
from .admin_views import *

urlpatterns = [
    #admin
    path("signup/", admin_signup, name="admin_signup"),
    path("login/", admin_login, name="admin_login"),
    path("forgot-password/", forgot_password, name="forgot_password"),
    path("reset-password/", reset_password, name="reset_password"),
    path('post_internship/', post_internship, name='post_internship'),
    path('internship/', get_internships, name='get_internships'),
    path("job_post/", job_post, name="job_post"),
    path("upload_achievement/",post_achievement,name="upload_acheivement"),

    #superadmin
    path("superadmin_signup/",super_admin_signup,name= "super_admin_signup"),
    path("superadmin_login/",super_admin_login,name="super_admin_login"),

    #common
    path("profile/<str:userId>/", get_profile, name="get_profile"),
    path("forgot-password/", forgot_password, name="forgot_password"),
    path("reset-password/", reset_password, name="reset_password"),
    
    #Jobs
    path('jobs', get_jobs, name='get_jobs'),
    path("review-job/<str:job_id>/", review_job, name="approve_job"),
    path('job/<str:job_id>/', get_job_by_id, name='get_job_by_id'),
    path('job-edit/<str:job_id>/', update_job, name='update_job'),
    path('job-delete/<str:job_id>/', delete_job, name='delete_job'),
    

    #Achievements
    path('achievements', get_achievements, name='get_achievements'),
    path('review-achievement/<str:achievement_id>/', review_achievement, name='review_achievement'),
    
    #Internships
    path('internship/', get_internships, name='get_internship'),
    path('review-internship/<str:internship_id>/', review_internship, name='review_internship'),
    
    #student
    path("stud/signup/", student_signup, name="student_signup"),
    path("stud/login/", student_login, name="student_login"),
    path('published-jobs/', get_published_jobs, name='get_published_jobs'),
    path('published-achievement/', get_published_achievements, name='get_published_achievements'),
    path('published-internship/', get_published_internships, name='get_published_internships'),
    path("contact-us/",contact_us,name="contact-us"),

]