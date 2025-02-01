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
    adminSignup: `${apiBaseURL}/signup/`,
    adminLogin: `${apiBaseURL}/login/`,
    postInternship: `${apiBaseURL}/internship/post/`,
    getInternships: `${apiBaseURL}/internship/`,
    
    // Superadmin
    superAdminSignup: `${apiBaseURL}/superadmin_signup/`,
    superAdminLogin: `${apiBaseURL}/superadmin_login/`,
    
    // Student
    studentSignup: `${apiBaseURL}/stud/signup/`,
    studentLogin: `${apiBaseURL}/stud/login/`,
  };

export {AppPages, apiBaseURL, apiEndpoints}