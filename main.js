const featuredProductGrid = document.getElementById("featuredProductGrid");
const filterButtons = document.querySelectorAll(".filter-pill");
const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

const offerModal = document.getElementById("offerModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalBody = document.getElementById("modalBody");

let activeFilter = "All";

function getTagColor(tag) {
  const tagColors = {
    "Club Pick": "#B08D3B",
    "Just Dropped": "#1A1A1A",
    "Steal": "#C0392B"
  };
  return tagColors[tag] || "#1A1A1A";
}

function createProductCard(product, index = 0) {
  const savings = Math.round((1 - product.price / product.retail) * 100);

  return `
    <article class="product-card reveal" style="transition-delay:${index * 0.06}s">
      <div class="product-image-wrap">
        <img src="${product.img}" alt="${product.name}">
        <div class="product-image-overlay"></div>

        ${
          product.tag
            ? `<span class="product-tag" style="background:${getTagColor(product.tag)}">${product.tag}</span>`
            : ""
        }

        <div class="product-save">SAVE ${savings}%</div>

        ${
          product.offers
            ? `<button class="product-offer-btn" data-id="${product.id}">Make an Offer</button>`
            : ""
        }
      </div>

      <div class="product-info">
        <div class="product-meta">${product.brand} · ${product.condition}</div>
        <div class="product-title">${product.name}</div>
        <div class="product-price-row">
          <span class="product-price">$${product.price}</span>
          <span class="product-retail">$${product.retail}</span>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  const filteredProducts =
    activeFilter === "All"
      ? PRODUCTS.slice(0, 8)
      : PRODUCTS.filter((product) => product.category === activeFilter).slice(0, 8);

  featuredProductGrid.innerHTML = filteredProducts
    .map((product, index) => createProductCard(product, index))
    .join("");

  bindOfferButtons();
  runRevealObserver();
}

function bindOfferButtons() {
  document.querySelectorAll(".product-offer-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      const product = PRODUCTS.find((item) => item.id === productId);
      openOfferModal(product);
    });
  });
}

function openOfferModal(product) {
  modalBody.innerHTML = `
    <div class="modal-eyebrow">Make an Offer</div>
    <h3 class="modal-title">${product.name}</h3>
    <p class="modal-subtitle">Listed at <strong>$${product.price}</strong> · Retail $${product.retail}</p>

    <label class="modal-body-label" for="offerAmount">Your offer ($)</label>
    <input class="modal-input" type="number" id="offerAmount" placeholder="e.g. ${Math.round(product.price * 0.8)}">
    <p class="modal-help">We'll accept, counter, or pass within 24 hours.</p>

    <button class="btn btn-dark modal-submit" id="submitOfferBtn">Submit Offer</button>
  `;

  offerModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  document.getElementById("submitOfferBtn").addEventListener("click", () => {
    const offerInput = document.getElementById("offerAmount");
    if (!offerInput.value.trim()) return;

    modalBody.innerHTML = `
      <div class="modal-success">
        <div class="modal-success-icon">🤝</div>
        <h3>Offer Submitted!</h3>
        <p>We'll review your offer on the ${product.name} and get back to you within 24 hours.</p>
      </div>
    `;
  });
}

function closeModal() {
  offerModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function setFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  renderFeaturedProducts();
}

function runRevealObserver() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => {
    if (!item.classList.contains("in-view")) {
      observer.observe(item);
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

menuBtn?.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  mobileNav.classList.toggle("open");
});

document.querySelectorAll('.mobile-nav a, .desktop-nav a, a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav?.classList.remove("open");
    menuBtn?.classList.remove("active");
  });
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

modalOverlay?.addEventListener("click", closeModal);
modalClose?.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

renderFeaturedProducts();
runRevealObserver();