const apiBaseURL = "http://localhost:8000"

const AppPages = {
    studentLogin: {
        route: "/login",
        name: "studentLogin",
        displayName: "Student Portal"
    },

    adminLogin: {
        route: "/admin/login",
        name: "adminLogin",
        displayName: "Admin Portal"
    },

    superUserLogin: {
        route: "/superAdmin/login",
        name: "superUserLogin",
        displayName: "Super Admin Portal"
    }
}

const apiEndpoints = {
    adminSignup: `${apiBaseURL}/api/signup/`,
    adminLogin: `${apiBaseURL}/api/login/`,
    postInternship: `${apiBaseURL}/api/internship/post/`,
    getInternships: `${apiBaseURL}/api/internship/`,
    
    // Superadmin
    superAdminSignup: `${apiBaseURL}/api/superadmin_signup/`,
    superAdminLogin: `${apiBaseURL}/api/superadmin_login/`,
    
    // Student
    studentSignup: `${apiBaseURL}/api/stud/signup/`,
    studentLogin: `${apiBaseURL}/api/stud/login/`,
  };

export {AppPages, apiBaseURL, apiEndpoints}