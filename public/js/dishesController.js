document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("dishModal");
  const openBtn = document.querySelector(".open-modal-btn");
  const authBtn = document.querySelector(".auth-btn");

  // Set auth button label based on login status
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (authBtn) {
    authBtn.textContent = isLoggedIn ? "Logout" : "Login";
    authBtn.addEventListener("click", () => {
      if (isLoggedIn) {
        localStorage.setItem("isLoggedIn", "false");
      }
      window.location.href = "/login";
    });
  }

  // Toggle modal on button click
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.style.display = modal.style.display === "block" ? "none" : "block";
    });
  }

  // Close modal when clicking outside it
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  const formRadios = document.getElementsByName("formType");
  const addForm = document.getElementById("addDishForm");
  const updateForm = document.getElementById("updateDishForm");

  formRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "add") {
        addForm.style.display = "block";
        updateForm.style.display = "none";
      } else {
        addForm.style.display = "none";
        updateForm.style.display = "block";
      }
    });
  });

  // Handle deleting dish
  async function deleteDish(dishId) {
    const res = await fetch(`/api/dishes/${dishId}`, {
      method: "DELETE",
    });

    await res.text();
    if (res.ok) {
      modal.style.display = "none";
      dishForm.reset();
      loadDishes();
    }
  }

  // Handle loading dishes
  async function loadDishes() {
    const response = await fetch("/api/dishes");
    const dishes = await response.json();

    const list = document.getElementById("dishList");
    list.innerHTML = "";

    dishes.forEach((dish) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ID: ${dish.dish_id} | Name: ${dish.dish_name} | Ingredients: ${dish.made_of} | Price: $${dish.price}
        <button onclick="deleteDish(${dish.dish_id})">Delete</button>
      `;
      list.appendChild(li);
    });
  }
  loadDishes();

  // Handle adding dish
  const dishForm = document.getElementById("addDishForm");
  if (dishForm) {
    dishForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("dish_id").value;
      const name = document.getElementById("dish_name").value;
      const price = document.getElementById("price").value;
      const description = document.getElementById("made_of").value;

      try {
        const res = await fetch("/api/dishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dish_id: id,
            dish_name: name,
            made_of: description,
            price: price,
          }),
        });

        await res.text();
        if (res.ok) {
          modal.style.display = "none";
          dishForm.reset();
          loadDishes();
        }
      } catch (err) {
        console.error(err);
      }
    });

    // Handle updating dish
    const updateDishForm = document.getElementById("updateDishForm");
    if (updateDishForm) {
      updateDishForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("update_id").value;
        const name = document.getElementById("update_name").value;
        const price = document.getElementById("update_price").value;
        const description = document.getElementById("update_made_of").value;

        try {
          const res = await fetch(`/api/dishes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dish_name: name,
              made_of: description,
              price: price,
            }),
          });

          await res.text();
          if (res.ok) {
            modal.style.display = "none";
            updateDishForm.reset();
            loadDishes();
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }
});
