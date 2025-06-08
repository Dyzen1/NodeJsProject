document.addEventListener("DOMContentLoaded", () => {
  // ========== AUTH BUTTON ==========
  const authBtn = document.querySelector(".auth-btn");
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

  // ========== MODAL SETUP ==========
  const modal = document.getElementById("dishModal");
  const openBtn = document.querySelector(".open-modal-btn");
  const closeBtn = document.querySelector(".close");
  const addForm = document.getElementById("addDishForm");
  const updateForm = document.getElementById("updateDishForm");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      addForm.style.display = "block";
      updateForm.style.display = "none";
      modal.style.display = "block";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // ========== LOAD DISHES ==========
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
        <button onclick="updateDish(${dish.dish_id})">Update</button>
      `;
      list.appendChild(li);
    });
  }
  loadDishes();

  // ========== DELETE DISH ==========
  window.deleteDish = async function (dishId) {
    const res = await fetch(`/api/dishes/${dishId}`, {
      method: "DELETE",
    });
    await res.text();
    if (res.ok) {
      addForm.reset(); 
      loadDishes();
    }
  };

  // ========== ADD NEW DISH ==========
  const dishForm = document.getElementById("addDishForm");
  if (dishForm) {
    dishForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = parseFloat(document.getElementById("dish_id").value);
      const name = document.getElementById("dish_name").value;
      const price = parseFloat(document.getElementById("price").value);
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
          dishForm.reset();
          modal.style.display = "none";
          loadDishes();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // ========== INITIATE UPDATE DISH ==========
  window.updateDish = function (dishId) {
    fetch(`/api/dishes`)
      .then((res) => res.json())
      .then((dishes) => {
        const dish = dishes.find((d) => d.dish_id === dishId);
        if (!dish) return alert("Dish not found");

        document.getElementById("update_id").value = dish.dish_id;
        document.getElementById("update_name").value = dish.dish_name;
        document.getElementById("update_price").value = dish.price;
        document.getElementById("update_made_of").value = dish.made_of;

        addForm.style.display = "none";
        updateForm.style.display = "block";
        modal.style.display = "block";
      });
  };

  // ========== SUBMIT UPDATE DISH ==========
  if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = parseFloat(document.getElementById("update_id").value);
      const name = document.getElementById("update_name").value;
      const price = parseFloat(document.getElementById("update_price").value);
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
          updateForm.reset();
          modal.style.display = "none";
          loadDishes();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
});
