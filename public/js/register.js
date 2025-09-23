const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const registerButton = registerForm.querySelector("button");

// Add inline error message div dynamically if not in HTML
let errorMessage = document.getElementById("errorMessage");
if (!errorMessage) {
  errorMessage = document.createElement("div");
  errorMessage.id = "errorMessage";
  errorMessage.className = "error-message";
  registerForm.insertBefore(errorMessage, registerButton);
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset error state
  errorMessage.textContent = "";
  [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input =>
    input.classList.remove("input-error")
  );

  // Change button text and disable it
  registerButton.textContent = "Creating account...";
  registerButton.disabled = true;

  // Password match check
  if (passwordInput.value !== confirmPasswordInput.value) {
    errorMessage.textContent = "Passwords do not match";
    passwordInput.classList.add("input-error");
    confirmPasswordInput.classList.add("input-error");
    confirmPasswordInput.focus();

    registerButton.textContent = "Register"; // reset button
    registerButton.disabled = false;
    return;
  }

  const formData = {
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };

  try {
    const response = await axios.post("/register", formData);
    const result = response.data;

    if (!result.success) {
      errorMessage.textContent = result.message || "Registration failed";

      if (result.message.includes("username")) {
        usernameInput.classList.add("input-error");
      }
      if (result.message.includes("email")) {
        emailInput.classList.add("input-error");
      }

      registerButton.textContent = "Register"; // reset button
      registerButton.disabled = false;
      return;
    }

    // Success → show confirmation and redirect after 2 seconds
    errorMessage.textContent = result.message || "Registration successful!";
    errorMessage.style.color = "green";

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);

  } catch (err) {
    console.error(err);
    errorMessage.textContent = err.response?.data?.message || "Server error";

    registerButton.textContent = "Register"; // reset button
    registerButton.disabled = false;
  }
});
