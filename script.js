const restaurantContainer = document.getElementById("restaurantContainer");
const restaurantPage = document.getElementById("restaurantPage");
const homePage = document.getElementById("homePage");
const restaurantDetails = document.getElementById("restaurantDetails");
const menuContainer = document.getElementById("menuContainer");

const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category");

let currentRestaurants = restaurants;

// ===============================
// CART
// ===============================

let cart = [];


// ===============================
// Display Restaurant Cards
// ===============================

function displayRestaurants(data) {

    restaurantContainer.innerHTML = "";

    data.forEach(res => {

        restaurantContainer.innerHTML += `
        
        <div class="card" onclick="openRestaurant(${res.id})">

            <img src="${res.image}" alt="${res.name}">

            <div class="card-content">

                <h3>${res.name}</h3>

                <p>${res.cuisines.join(", ")}</p>

                <p class="rating">⭐ ${res.rating}</p>

                <p>${res.deliveryTime}</p>

                <p>${res.priceForTwo} for two</p>

            </div>

        </div>

        `;

    });
}


// ===============================
// Open Restaurant
// ===============================

function openRestaurant(id) {

    const restaurant = restaurants.find(r => r.id === id);

    homePage.classList.add("hidden");

    restaurantPage.classList.remove("hidden");

    restaurantDetails.innerHTML = `

        <h2>${restaurant.name}</h2>

        <p>
            <strong>Rating:</strong> ⭐ ${restaurant.rating}
        </p>

        <p>
            <strong>Address:</strong> ${restaurant.address}
        </p>

        <p>
            <strong>Delivery:</strong> ${restaurant.deliveryTime}
        </p>

    `;

    displayMenu(restaurant.menu);
}


// ===============================
// Display Menu
// ===============================

function displayMenu(menu) {

    menuContainer.innerHTML = "";

    menu.forEach(item => {

        menuContainer.innerHTML += `

        <div class="menu-card">

            <img src="${item.image}" alt="${item.name}">

            <div class="menu-content">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <p>
                    <strong>₹${item.price}</strong>
                </p>

                <p>
                    ${item.veg ? "🟢 Veg" : "🔴 Non Veg"}
                </p>

                <button onclick="addToCart(${item.id})">
                    Add to Cart
                </button>

            </div>

        </div>

        `;

    });
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(itemId) {

    let itemFound = null;

    restaurants.forEach(res => {

        const item = res.menu.find(item => item.id === itemId);

        if (item) {
            itemFound = item;
        }

    });

    if (!itemFound) {
        alert("Item not found!");
        return;
    }

    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...itemFound,
            quantity: 1
        });

    }

    alert(itemFound.name + " added to cart!");

    updateCart();

}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const cartContainer = document.getElementById("cartContainer");

    if (!cartContainer) {
        return;
    }

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <h2>🛒 Your Cart</h2>
            <p>Your cart is empty.</p>
        `;

        return;
    }

    let total = 0;

    let cartHTML = `
        <h2>🛒 Your Cart</h2>
    `;

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        cartHTML += `

            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-details">

                    <h3>${item.name}</h3>

                    <p>₹${item.price}</p>

                    <div class="quantity">

                        <button onclick="decreaseQuantity(${item.id})">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="increaseQuantity(${item.id})">
                            +
                        </button>

                    </div>

                    <p>
                        <strong>₹${itemTotal}</strong>
                    </p>

                    <button onclick="removeFromCart(${item.id})">
                        🗑️ Remove
                    </button>

                </div>

            </div>

        `;

    });

    cartHTML += `

        <div class="cart-total">

            <h3>Total: ₹${total}</h3>

            <button onclick="placeOrder()">
                📦 Place Order
            </button>

        </div>

    `;

    cartContainer.innerHTML = cartHTML;
}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(itemId) {

    const item = cart.find(item => item.id === itemId);

    if (item) {

        item.quantity++;

        updateCart();

    }
}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQuantity(itemId) {

    const item = cart.find(item => item.id === itemId);

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart = cart.filter(item => item.id !== itemId);

    }

    updateCart();
}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(itemId) {

    cart = cart.filter(item => item.id !== itemId);

    updateCart();

}


// ===============================
// PLACE ORDER
// ===============================

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

    });

    const confirmOrder = confirm(
        "Do you want to place your order?\n\n" +
        "Total Amount: ₹" + total
    );

    if (confirmOrder) {

        alert(
            "✅ Order Placed Successfully!\n\n" +
            "Total Amount: ₹" + total +
            "\n\nThank you for ordering!"
        );

        cart = [];

        updateCart();

    }

}


// ===============================
// BACK BUTTON
// ===============================

document.getElementById("backHome").addEventListener("click", () => {

    restaurantPage.classList.add("hidden");

    homePage.classList.remove("hidden");

});


// ===============================
// SEARCH RESTAURANTS & DISHES
// ===============================

searchInput.addEventListener("keyup", function () {

    const text = this.value.toLowerCase();

    const filtered = restaurants.filter(res => {

        const restaurantMatch =
            res.name.toLowerCase().includes(text);

        const cuisineMatch =
            res.cuisines
                .join(" ")
                .toLowerCase()
                .includes(text);

        const menuMatch =
            res.menu.some(item =>
                item.name.toLowerCase().includes(text)
            );

        return restaurantMatch ||
               cuisineMatch ||
               menuMatch;

    });

    displayRestaurants(filtered);

});


// ===============================
// CATEGORY FILTER
// ===============================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.innerText;

        if (category === "All") {

            displayRestaurants(restaurants);

            return;
        }

        const filtered = restaurants.filter(res =>

            res.cuisines.some(cuisine =>

                cuisine.toLowerCase() ===
                category.toLowerCase()

            )

        );

        displayRestaurants(filtered);

    });

});


// ===============================
// INITIAL LOAD
// ===============================

displayRestaurants(restaurants);


// ===============================
// SHOW CART WHEN PAGE LOADS
// ===============================

updateCart();