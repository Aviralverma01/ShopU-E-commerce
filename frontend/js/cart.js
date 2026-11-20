
// =====================================
// TASK ONE - CART FUNCTIONALITY
// =====================================

const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");

const totalItems = document.getElementById("cart-total-items");
const subtotal = document.getElementById("cart-subtotal");
const totalAmount = document.getElementById("cart-total");

const checkoutButton = document.getElementById("checkout-btn");

// =====================================
// GET CART FROM LOCAL STORAGE
// =====================================

function getCart() {

    return JSON.parse(localStorage.getItem("cart")) || [];

}

// =====================================
// SAVE CART
// =====================================

function saveCart(cart) {

    localStorage.setItem("cart", JSON.stringify(cart));

}

// =====================================
// DISPLAY CART ITEMS
// =====================================

function displayCart() {

    const cart = getCart();

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        emptyCart.hidden = false;

        totalItems.textContent = "0";
        subtotal.textContent = "₹0";
        totalAmount.textContent = "₹0";

        checkoutButton.disabled = true;

        return;
    }

    emptyCart.hidden = true;
    checkoutButton.disabled = false;

    let itemCount = 0;
    let total = 0;

    cart.forEach((item, index) => {

        itemCount += item.quantity;

        total += item.price * item.quantity;

        const itemCard = document.createElement("div");

        itemCard.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image || "https://placehold.co/100x100?text=Product";
        image.alt = item.name;

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = `₹${item.price}`;

        const quantity = document.createElement("p");
        quantity.textContent = `Quantity: ${item.quantity}`;

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.addEventListener("click", () => updateQuantity(index, -1));

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.addEventListener("click", () => updateQuantity(index, 1));

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removeItem(index));

        details.append(
            name,
            price,
            quantity,
            decreaseButton,
            increaseButton,
            removeButton
        );

        itemCard.append(image, details);

        cartItems.appendChild(itemCard);

    });

    totalItems.textContent = itemCount;
    subtotal.textContent = `₹${total}`;
    totalAmount.textContent = `₹${total}`;

}

// =====================================
// UPDATE PRODUCT QUANTITY
// =====================================

function updateQuantity(index, change) {

    const cart = getCart();

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart(cart);

    displayCart();

}

// =====================================
// REMOVE PRODUCT
// =====================================

function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();

}

// =====================================
// CHECKOUT BUTTON
// =====================================

checkoutButton.addEventListener("click", () => {

    if (!isLoggedIn()) {

        alert("Please login before checkout.");

        window.location.href = "login.html";

        return;
    }

    window.location.href = "checkout.html";

});

// =====================================
// INITIALIZE CART
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    displayCart();

});
