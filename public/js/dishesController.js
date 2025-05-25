document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('dishModal');
  const openBtn = document.querySelector('.open-modal-btn');
  const logoutBtn = document.querySelector('.logout-btn');

      modal.style.display = 'none';


  // Toggle modal on button click
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      } else {
        modal.style.display = 'block';
      }
    });
  }

  // Close modal when clicking outside it
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Replace with your actual logout logic
      alert('Logging out...');
      window.location.href = '/login'; // Or /auth/logout
    });
  }

  // Handle form submission
  const dishForm = document.getElementById('addDishForm');
  if (dishForm) {
    dishForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('dishName').value;
      const price = document.getElementById('dishPrice').value;
      const description = document.getElementById('dishDescription').value;

      try {
        const res = await fetch('/api/dishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, price, description })
        });

        const result = await res.json();
        if (res.ok) {
          alert('Dish added successfully!');
          modal.style.display = 'none';
          dishForm.reset();
          // Optionally: reload dish list
        } else {
          alert(result.message || 'Failed to add dish');
        }
      } catch (err) {
        console.error(err);
        alert('Server error.');
      }
    });
  }
});
