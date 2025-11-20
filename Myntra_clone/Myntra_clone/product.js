document.addEventListener("DOMContentLoaded", () => {
  const wishlistCount = document.getElementById("wishlist-count");
  const bagCount = document.getElementById("bag-count");

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let bag = JSON.parse(localStorage.getItem("bag")) || [];

  updateCounts();

  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const product = getProductData(card);

      if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        showPopup(`${product.name} added to wishlist`);
        updateCounts();
      } else {
        showPopup(`${product.name} is already in wishlist!`);
      }
    });
  });

  document.querySelectorAll(".bag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const product = getProductData(card);

      if (!bag.some(item => item.id === product.id)) {
        bag.push(product);
        localStorage.setItem("bag", JSON.stringify(bag));
        showPopup(`${product.name} added to bag`);
        updateCounts();
      } else {
        showPopup(`${product.name} is already in bag!`);
      }
    });
  });

  function getProductData(card) {
    return {
      id: card.dataset.id,
      name: card.dataset.name,
      price: card.dataset.price,
      image: card.dataset.image
    };
  }

  function updateCounts() {
    wishlistCount.textContent = wishlist.length;
    bagCount.textContent = bag.length;
  }

  function showPopup(message) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.className = "popup-message";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
  }
});
