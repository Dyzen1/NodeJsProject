document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');
  const openBtn = document.querySelector('.open-modal-btn');
  const logoutBtn = document.querySelector('.logout-btn');

  // ✅ Always close modal on load
  modal.style.display = 'none';

  // ✅ Toggle modal on click
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    });
  }

  // ✅ Close modal if clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // ✅ Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      alert('Logging out...');
      window.location.href = '/login';
    });
  }

  // ✅ Handle form submit
  const productForm = document.getElementById('addProductForm');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('productName').value;
      const stock = document.getElementById('productStock').value;
      const price = document.getElementById('productPrice').value;

      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, stock, price })
        });

        const result = await res.json();
        if (res.ok) {
          alert('Product added successfully!');
          modal.style.display = 'none';
          productForm.reset();
          // Optional: reload product list
        } else {
          alert(result.message || 'Failed to add product');
        }
      } catch (err) {
        console.error(err);
        alert('Server error.');
      }
    });
  }
});
