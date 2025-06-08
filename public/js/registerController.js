document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const text = await res.text();
      console.log("Response:", res.status, text);

      if (res.ok) {
        alert("Registered successfully!");
        window.location.href = "/";
      } else {
        alert("Registration failed: " + text);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  });
});
