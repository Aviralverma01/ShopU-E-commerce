
// =====================================
// TASK ONE - AUTHENTICATION
// =====================================

// Get forms
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Get message container
const authMessage = document.getElementById("auth-message");

// =====================================
// USER REGISTRATION
// =====================================

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            authMessage.textContent = "Creating your account...";

            const result = await apiRequest("/auth/register", "POST", {
                name,
                email,
                password
            });

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            authMessage.textContent = "Registration successful!";

            window.location.href = "index.html";

        } catch (error) {

            authMessage.textContent = error.message;

        }

    });

}

// =====================================
// USER LOGIN
// =====================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            authMessage.textContent = "Logging in...";

            const result = await apiRequest("/auth/login", "POST", {
                email,
                password
            });

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            authMessage.textContent = "Login successful!";

            window.location.href = "index.html";

        } catch (error) {

            authMessage.textContent = error.message;

        }

    });

}
