
const productId = new URLSearchParams(window.location.search).get("id");

const productImage = document.getElementById("product-image");
const productName = document.getElementById("product-name");
const productCategory = document.getElementById("product-category");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const productStock = document.getElementById("product-stock");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const productMessage = document.getElementById("product-message");

let selectedProduct = null;

// Load product details
async function loadProduct() {
    try {
        if (!productId) {
            throw new Error("Product ID is missing.");
        }

        const data = await apiRequest(`/products/${productId}`);
        selectedProduct = data.product || data;

        productImage.src = selectedProduct.image || "";
        productImage.alt = selectedProduct.name;

        productName.textContent = selectedProduct.name;
        productCategory.textContent = selectedProduct.category;
        productPrice.textContent = `₹${selectedProduct.price}`;
        productDescription.textContent = selectedProduct.description;
        productStock.textContent = `Available Stock: ${selectedProduct.stock}`;

        addToCartBtn.disabled = selectedProduct.stock <= 0;

        if (selectedProduct.stock <= 0) {
            addToCartBtn.textContent = "Out of Stock";
        }

    } catch (error) {
        productName.textContent = "Product Not Found";
        productMessage.textContent = error.message;
        addToCartBtn.disabled = true;
    }
}

// Add product to cart
addToCartBtn.addEventListener("click", () => {
    if (!selectedProduct) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        item => item.productId === selectedProduct._id
    );

    if (existingProduct) {
        if (existingProduct.quantity >= selectedProduct.stock) {
            productMessage.textContent = "Maximum available stock reached.";
            return;
        }

        existingProduct.quantity++;
    } else {
        cart.push({
            productId: selectedProduct._id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    productMessage.textContent = "Product added to cart successfully!";
});

// Start loading the product
loadProduct();
