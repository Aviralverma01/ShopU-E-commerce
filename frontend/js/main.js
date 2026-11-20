
// =====================================
// TASK ONE - HOMEPAGE FUNCTIONALITY
// =====================================

// Get featured products container
const featuredProducts = document.getElementById("featured-products");

// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayFeaturedProducts(products) {

    if (!featuredProducts) return;

    featuredProducts.innerHTML = "";

    if (!products || products.length === 0) {
        featuredProducts.innerHTML = `
            <p class="empty-message">
                No products available right now.
            </p>
        `;
        return;
    }

    // Display maximum 4 products
    products.slice(0, 4).forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <img
                src="${product.image || 'https://placehold.co/300x200?text=Product'}"
                alt="${product.name}"
            >

            <h3>${product.name}</h3>

            <p>${product.description || "Quality product"}</p>

            <div class="price">₹${product.price}</div>

            <button
                class="primary-btn"
                onclick="viewProduct('${product._id}')"
            >
                View Product
            </button>
        `;

        featuredProducts.appendChild(productCard);

    });
}

// =====================================
// LOAD FEATURED PRODUCTS
// =====================================

async function loadFeaturedProducts() {

    if (!featuredProducts) return;

    try {

        featuredProducts.innerHTML = "<p>Loading products...</p>";

        const products = await apiRequest("/products");

        displayFeaturedProducts(products);

    } catch (error) {

        featuredProducts.innerHTML = `
            <p class="empty-message">
                Unable to load products. Please try again later.
            </p>
        `;

        console.error(error.message);
    }
}

// =====================================
// VIEW PRODUCT
// =====================================

function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// =====================================
// INITIALIZE HOMEPAGE
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedProducts();

});
