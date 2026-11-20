
// =====================================
// TASK ONE - ORDER HISTORY
// =====================================

const ordersList = document.getElementById("orders-list");
const noOrders = document.getElementById("no-orders");
const ordersMessage = document.getElementById("orders-message");
const refreshButton = document.getElementById("refresh-orders");

// =====================================
// DISPLAY ORDERS
// =====================================

function displayOrders(orders) {

    ordersList.innerHTML = "";

    if (!orders || orders.length === 0) {

        noOrders.hidden = false;
        return;

    }

    noOrders.hidden = true;

    orders.forEach(order => {

        const orderCard = document.createElement("div");

        orderCard.className = "order-card";

        const heading = document.createElement("h3");
        heading.textContent = `Order #${order._id}`;

        const date = document.createElement("p");

        date.textContent = `Date: ${
            new Date(order.createdAt).toLocaleDateString()
        }`;

        const amount = document.createElement("p");

        amount.textContent = `Total Amount: ₹${order.totalAmount}`;

        const status = document.createElement("p");

        status.textContent = `Status: ${order.status}`;

        const payment = document.createElement("p");

        payment.textContent = `Payment: ${order.paymentMethod}`;

        const productsHeading = document.createElement("p");

        productsHeading.textContent = "Products:";

        const productList = document.createElement("ul");

        order.items.forEach(item => {

            const listItem = document.createElement("li");

            const productName = item.product
                ? item.product.name
                : "Product unavailable";

            listItem.textContent =
                `${productName} × ${item.quantity}`;

            productList.appendChild(listItem);

        });

        orderCard.append(
            heading,
            date,
            amount,
            status,
            payment,
            productsHeading,
            productList
        );

        ordersList.appendChild(orderCard);

    });

}

// =====================================
// LOAD MY ORDERS
// =====================================

async function loadOrders() {

    if (!isLoggedIn()) {

        ordersMessage.textContent = "Please login to view your orders.";

        return;

    }

    try {

        ordersMessage.textContent = "Loading your orders...";

        const orders = await apiRequest("/orders/my-orders");

        displayOrders(orders);

        ordersMessage.textContent = "";

    } catch (error) {

        ordersMessage.textContent = error.message;

        console.error(error.message);

    }

}

// =====================================
// REFRESH ORDERS
// =====================================

refreshButton.addEventListener("click", loadOrders);

// =====================================
// INITIALIZE ORDERS PAGE
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadOrders();

});
