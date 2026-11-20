
// =====================================
// TASK ONE - PRODUCTS FUNCTIONALITY
// =====================================

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const searchBtn = document.getElementById("search-btn");
const productCount = document.getElementById("product-count");
const noProducts = document.getElementById("no-products");

// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts(products) {

    productList.innerHTML = "";

    if (!products || products.length === 0) {
        noProducts.hidden = false;
        productCount.textContent = "0 products found";
        return;
    }

    noProducts.hidden = true;
    productCount.textContent = `${products.length} products found`;

    products.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        // Product Image
        const image = document.createElement("img");
        image.src = product.image || "https://placehold.co/300x200?text=Product";
        image.alt = product.name;

        // Product Name
        const name = document.createElement("h3");
        name.textContent = product.name;

        // Product Description
        const description = document.createElement("p");
        description.textContent = product.description || "Quality product";

        // Product Price
        const price = document.createElement("div");
        price.className = "price";
        price.textContent = `₹${product.price}`;

        // View Details Button
        const detailsBtn = document.createElement("button");
        detailsBtn.className = "primary-btn";
        detailsBtn.textContent = "View Details";

        detailsBtn.addEventListener("click", () => {
            window.location.href =
                `product-details.html?id=${encodeURIComponent(product._id)}`;
        });

        // Add to Cart Button
        const button = document.createElement("button");
        button.className = "primary-btn";
        button.textContent = "Add to Cart";

        button.disabled = product.stock <= 0;

        if (product.stock <= 0) {
            button.textContent = "Out of Stock";
        }

        button.addEventListener("click", () => {
            addToCart(product);
        });

        // Add elements to card
        card.append(
            image,
            name,
            description,
            price,
            detailsBtn,
            button
        );

        productList.appendChild(card);

    });
}

// =====================================
// LOAD PRODUCTS
// =====================================

async function loadProducts() {

    try {

        productList.innerHTML = "<p>Loading products...</p>";

        const params = new URLSearchParams();

        const search = searchInput.value.trim();
        const category = categoryFilter.value;

        if (search) params.append("search", search);
        if (category) params.append("category", category);

        const query = params.toString();

        const endpoint = query
            ? `/products?${query}`
            : "/products";

        const data = await apiRequest(endpoint);

        const products = Array.isArray(data)
            ? data
            : data.products || [];

        displayProducts(products);

    } catch (error) {

        productList.innerHTML = `
            <p class="empty-message">
                Unable to load products. Please try again.
            </p>
        `;

        console.error("Product loading error:", error.message);
    }
}

// =====================================
// ADD PRODUCT TO CART
// =====================================

function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        item => item.productId === product._id
    );

    if (product.stock <= 0) {
        alert("This product is out of stock.");
        return;
    }

    if (existingProduct) {

        if (existingProduct.quantity >= product.stock) {
            alert("Maximum available stock reached.");
            return;
        }

        existingProduct.quantity++;

    } else {

        cart.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
}

// =====================================
// INITIALIZE PRODUCTS PAGE
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // Search Button
    searchBtn.addEventListener("click", loadProducts);

    // Category Filter
    categoryFilter.addEventListener("change", loadProducts);

    // Search on Enter Key
    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            loadProducts();
        }

    });

    // Read Category from URL
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (category) {
        categoryFilter.value = category;
    }

    // Load Products
    loadProducts();

});
