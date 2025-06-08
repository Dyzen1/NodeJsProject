document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.querySelector(".auth-btn");

  if (!authBtn) return;

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  authBtn.textContent = isLoggedIn ? "Logout" : "Login";

  authBtn.addEventListener("click", () => {
    if (isLoggedIn) {
      // Log out
      localStorage.setItem("isLoggedIn", "false");
      window.location.href = "/"; 
    } else {
      // Log in
      window.location.href = "/login";
    }
  });
});
