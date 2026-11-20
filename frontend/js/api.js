
// =====================================
// TASK ONE - API CONFIGURATION
// =====================================

// Backend server URL
const API_URL = "http://localhost:5000/api";

// =====================================
// GET AUTH TOKEN
// =====================================

function getToken() {
    return localStorage.getItem("token");
}

// =====================================
// COMMON API REQUEST FUNCTION
// =====================================

async function apiRequest(endpoint, method = "GET", data = null) {
    try {
        const headers = {
            "Content-Type": "application/json"
        };

        const token = getToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const options = {
            method,
            headers
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        return result;

    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
}

// =====================================
// AUTHENTICATION CHECK
// =====================================

function isLoggedIn() {
    return Boolean(getToken());
}

// =====================================
// LOGOUT FUNCTION
// =====================================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}
