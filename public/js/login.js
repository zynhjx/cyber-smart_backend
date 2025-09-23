const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = form.querySelector("button");

// Add inline error message div dynamically if not in HTML
let errorMessage = document.getElementById("errorMessage");
if (!errorMessage) {
  errorMessage = document.createElement("div");
  errorMessage.id = "errorMessage";
  errorMessage.className = "error-message";
  form.insertBefore(errorMessage, loginButton);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop normal POST/redirect

  // Clear previous errors
  errorMessage.textContent = "";
  usernameInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  // Change button state
  loginButton.textContent = "Logging in...";
  loginButton.disabled = true;

  try {
    const response = await fetch("/login", {
      method: "POST",
      credentials: "include", // keep session cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value
      })
    });

    const result = await response.json();

    if (result.success) {
      errorMessage.textContent = ""; // clear any errors
      window.location.href = "/dashboard"; // redirect on success
    } else {
      errorMessage.textContent = result.message || "Invalid login";

      if (result.userExists === false) {
        usernameInput.classList.add("input-error");
      }

      if (result.passwordCorrect === false) {
        passwordInput.classList.add("input-error");
      }

      passwordInput.value = ""; // clear password
      passwordInput.focus();
      loginButton.textContent = "Log In"; // reset button
      loginButton.disabled = false;
    }

  } catch (err) {
    console.error(err);
    errorMessage.textContent = "Server error";
    loginButton.textContent = "Log In"; // reset button
    loginButton.disabled = false;
  }
});
