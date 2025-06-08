document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), 
      });

      const text = await res.text();
      console.log("Response:", res.status, text);

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/home";
      } else {
        alert("Login failed: " + text);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  });
});
