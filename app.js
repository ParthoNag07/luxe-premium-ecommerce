/* =========================================================
   LUXE PREMIUM E-COMMERCE
   app.js
   ========================================================= */


/* ================= PRODUCT DATA ================= */

const products = [
    {
        id: 1,
        name: "Essential Oversized Tee",
        category: "clothing",
        price: 1499,
        oldPrice: 1999,
        badge: "Bestseller",
        description:
            "A premium oversized everyday t-shirt designed with a relaxed silhouette and clean minimal styling.",
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 2,
        name: "Classic Linen Shirt",
        category: "clothing",
        price: 2499,
        oldPrice: 2999,
        badge: "New",
        description:
            "A lightweight linen shirt with a timeless silhouette for effortless everyday dressing.",
        image:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 3,
        name: "Premium Leather Wallet",
        category: "accessories",
        price: 1799,
        oldPrice: 2299,
        badge: "Popular",
        description:
            "Minimal leather wallet designed for everyday use with a refined premium finish.",
        image:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 4,
        name: "Minimal Watch",
        category: "accessories",
        price: 3499,
        oldPrice: 4299,
        badge: "New",
        description:
            "A clean minimalist watch designed to complement both casual and formal outfits.",
        image:
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 5,
        name: "Urban Sneakers",
        category: "footwear",
        price: 3999,
        oldPrice: 4999,
        badge: "Bestseller",
        description:
            "Modern everyday sneakers combining comfort, clean design and versatile styling.",
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 6,
        name: "Leather Chelsea Boots",
        category: "footwear",
        price: 4999,
        oldPrice: 5999,
        badge: "Premium",
        description:
            "Classic Chelsea boots featuring a sleek profile and premium-inspired leather finish.",
        image:
            "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 7,
        name: "Relaxed Cotton Hoodie",
        category: "clothing",
        price: 2299,
        oldPrice: 2799,
        badge: "New",
        description:
            "A soft relaxed hoodie built for comfortable everyday layering.",
        image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 8,
        name: "Classic Sunglasses",
        category: "accessories",
        price: 1999,
        oldPrice: 2499,
        badge: "Trending",
        description:
            "Timeless sunglasses with a clean frame designed for a sophisticated everyday look.",
        image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85"
    }
];


/* ================= CART ================= */

const Cart = {

    get() {
        try {
            return JSON.parse(localStorage.getItem("luxe-cart")) || [];
        } catch {
            return [];
        }
    },


    save(cart) {
        localStorage.setItem(
            "luxe-cart",
            JSON.stringify(cart)
        );

        updateCartCount();
    },


    add(productId, quantity = 1) {

        const cart = this.get();

        const existing = cart.find(
            item => item.id === productId
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                quantity: quantity
            });
        }

        this.save(cart);

        const product = getProduct(productId);

        if (product) {
            showToast(
                `${product.name} added to cart`
            );
        }
    },


    remove(productId) {

        let cart = this.get();

        cart = cart.filter(
            item => item.id !== productId
        );

        this.save(cart);

        renderCart();
    },


    update(productId, quantity) {

        let cart = this.get();

        const item = cart.find(
            item => item.id === productId
        );

        if (!item) return;

        if (quantity <= 0) {
            this.remove(productId);
            return;
        }

        item.quantity = quantity;

        this.save(cart);

        renderCart();
    },


    clear() {

        localStorage.removeItem("luxe-cart");

        updateCartCount();

        renderCart();
    },


    total() {

        return this.get().reduce(
            (total, item) => {

                const product =
                    getProduct(item.id);

                if (!product) {
                    return total;
                }

                return total +
                    product.price *
                    item.quantity;

            },
            0
        );
    },


    count() {

        return this.get().reduce(
            (total, item) =>
                total + item.quantity,
            0
        );
    }

};


/* ================= WISHLIST ================= */

const Wishlist = {

    get() {

        try {
            return JSON.parse(
                localStorage.getItem("luxe-wishlist")
            ) || [];
        } catch {
            return [];
        }
    },


    save(items) {

        localStorage.setItem(
            "luxe-wishlist",
            JSON.stringify(items)
        );
    },


    has(productId) {

        return this.get().includes(productId);
    },


    toggle(productId) {

        let items = this.get();

        if (items.includes(productId)) {

            items = items.filter(
                id => id !== productId
            );

            this.save(items);

            showToast("Removed from wishlist");

        } else {

            items.push(productId);

            this.save(items);

            const product =
                getProduct(productId);

            showToast(
                `${product.name} added to wishlist`
            );
        }

        refreshWishlistButtons();
    }

};


/* ================= HELPERS ================= */

function getProduct(id) {

    return products.find(
        product => product.id === Number(id)
    );
}


function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);
}


function updateCartCount() {

    const elements =
        document.querySelectorAll("#cart-count");

    const count = Cart.count();

    elements.forEach(element => {
        element.textContent = count;
    });
}


/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* ================= PRODUCT CARD ================= */

function renderProductCard(product) {

    const wished =
        Wishlist.has(product.id);

    return `
        <article class="product-card">

            ${
                product.badge
                    ? `
                        <span class="product-badge">
                            ${product.badge}
                        </span>
                    `
                    : ""
            }

            <a
                href="product.html?id=${product.id}"
                class="product-image"
            >

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </a>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <a
                    href="product.html?id=${product.id}"
                >
                    <h3 class="product-title">
                        ${product.name}
                    </h3>
                </a>


                <div class="product-price">

                    ${formatPrice(product.price)}

                    ${
                        product.oldPrice
                            ? `
                                <span class="product-old-price">
                                    ${formatPrice(
                                        product.oldPrice
                                    )}
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="product-actions">

                    <button
                        class="add-cart-btn"
                        onclick="Cart.add(${product.id})"
                    >
                        Add to Cart
                    </button>


                    <button
                        class="wishlist-btn ${
                            wished ? "active" : ""
                        }"
                        onclick="Wishlist.toggle(${product.id})"
                        aria-label="Add to wishlist"
                    >
                        ${wished ? "♥" : "♡"}
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* ================= FEATURED PRODUCTS ================= */

function renderFeaturedProducts() {

    const container =
        document.getElementById(
            "featured-products"
        );

    if (!container) return;

    const featured =
        products.slice(0, 4);

    container.innerHTML =
        featured
            .map(renderProductCard)
            .join("");

}


/* ================= SHOP PRODUCTS ================= */

function renderShopProducts(
    category = "all",
    search = ""
) {

    const container =
        document.getElementById(
            "shop-products"
        );

    if (!container) return;


    let filtered = [...products];


    if (category !== "all") {

        filtered =
            filtered.filter(
                product =>
                    product.category === category
            );

    }


    if (search.trim()) {

        const query =
            search.toLowerCase().trim();

        filtered =
            filtered.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(query)
            );
    }


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>No products found</h2>
                <p>
                    Try another category or search term.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        filtered
            .map(renderProductCard)
            .join("");

}


/* ================= WISHLIST BUTTONS ================= */

function refreshWishlistButtons() {

    document
        .querySelectorAll(".wishlist-btn")
        .forEach(button => {

            const onclick =
                button.getAttribute("onclick");

            if (!onclick) return;

            const match =
                onclick.match(/toggle\((\d+)\)/);

            if (!match) return;

            const productId =
                Number(match[1]);

            const active =
                Wishlist.has(productId);

            button.classList.toggle(
                "active",
                active
            );

            button.textContent =
                active ? "♥" : "♡";
        });
}


/* ================= MOBILE MENU ================= */

function toggleMobileMenu() {

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    if (!menu) return;

    menu.classList.toggle("open");
}


/* ================= NEWSLETTER ================= */

function subscribeNewsletter(event) {

    event.preventDefault();

    const input =
        document.getElementById(
            "newsletter-email"
        );

    if (!input) return;

    const email =
        input.value.trim();

    if (!email) return;

    showToast(
        "Thanks! You're now subscribed to LUXE."
    );

    input.value = "";
}


/* ================= PRODUCT PAGE ================= */

function renderProductPage() {

    const container =
        document.getElementById(
            "product-detail-content"
        );

    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        Number(params.get("id")) || 1;


    const product =
        getProduct(id);


    if (!product) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>Product not found</h2>
                <a
                    href="shop.html"
                    class="btn btn-dark"
                >
                    Back to Shop
                </a>
            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="product-detail-grid">

            <div class="product-main-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-detail-info">

                <span class="eyebrow">
                    ${product.category}
                </span>

                <h1>
                    ${product.name}
                </h1>

                <div class="detail-price">
                    ${formatPrice(product.price)}
                </div>

                <p class="detail-description">
                    ${product.description}
                </p>


                <div
                    style="
                        display:flex;
                        gap:15px;
                        align-items:center;
                        margin-bottom:25px;
                    "
                >

                    <div class="quantity-control">

                        <button
                            onclick="changeDetailQuantity(-1)"
                        >
                            −
                        </button>

                        <span id="detail-quantity">
                            1
                        </span>

                        <button
                            onclick="changeDetailQuantity(1)"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        flex-wrap:wrap;
                    "
                >

                    <button
                        class="btn btn-dark"
                        onclick="
                            addDetailProduct(
                                ${product.id}
                            )
                        "
                    >
                        Add to Cart
                    </button>

                    <button
                        class="wishlist-btn ${
                            Wishlist.has(product.id)
                                ? "active"
                                : ""
                        }"
                        onclick="
                            Wishlist.toggle(
                                ${product.id}
                            )
                        "
                    >
                        ${
                            Wishlist.has(product.id)
                                ? "♥"
                                : "♡"
                        }
                    </button>

                </div>

            </div>

        </div>
    `;
}


function changeDetailQuantity(change) {

    const element =
        document.getElementById(
            "detail-quantity"
        );

    if (!element) return;

    let quantity =
        Number(element.textContent);

    quantity += change;

    if (quantity < 1) {
        quantity = 1;
    }

    if (quantity > 10) {
        quantity = 10;
    }

    element.textContent = quantity;
}


function addDetailProduct(productId) {

    const quantityElement =
        document.getElementById(
            "detail-quantity"
        );

    const quantity =
        quantityElement
            ? Number(quantityElement.textContent)
            : 1;

    Cart.add(productId, quantity);
}


/* ================= CART PAGE ================= */

function renderCart() {

    const container =
        document.getElementById(
            "cart-items"
        );

    if (!container) return;


    const cart = Cart.get();


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Discover something beautiful
                    for your collection.
                </p>

                <a
                    href="shop.html"
                    class="btn btn-dark"
                >
                    Start Shopping
                </a>

            </div>
        `;

        updateCartSummary();

        return;
    }


    container.innerHTML =
        cart.map(item => {

            const product =
                getProduct(item.id);

            if (!product) return "";

            return `

                <div class="cart-item">

                    <a
                        href="product.html?id=${product.id}"
                        class="cart-item-image"
                    >

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </a>


                    <div class="cart-item-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.category}
                        </p>


                        <div
                            class="quantity-control"
                            style="margin-top:12px;"
                        >

                            <button
                                onclick="
                                    Cart.update(
                                        ${product.id},
                                        ${item.quantity - 1}
                                    )
                                "
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="
                                    Cart.update(
                                        ${product.id},
                                        ${item.quantity + 1}
                                    )
                                "
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <div>

                        <div class="cart-item-price">
                            ${formatPrice(
                                product.price *
                                item.quantity
                            )}
                        </div>

                        <button
                            onclick="
                                Cart.remove(
                                    ${product.id}
                                )
                            "
                            style="
                                margin-top:12px;
                                background:none;
                                color:#999;
                                font-size:11px;
                            "
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `;

        }).join("");


    updateCartSummary();
}


/* ================= CART SUMMARY ================= */

function updateCartSummary() {

    const subtotal =
        Cart.total();

    const shipping =
        subtotal === 0
            ? 0
            : subtotal >= 4999
                ? 0
                : 199;

    const total =
        subtotal + shipping;


    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );

    const shippingElement =
        document.getElementById(
            "cart-shipping"
        );

    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0
                ? "FREE"
                : formatPrice(shipping);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }
}


/* ================= CHECKOUT ================= */

function renderCheckout() {

    const container =
        document.getElementById(
            "checkout-items"
        );

    if (!container) return;


    const cart = Cart.get();


    if (cart.length === 0) {

        container.innerHTML = `
            <p style="color:#777;">
                Your cart is empty.
            </p>
        `;

        return;
    }


    container.innerHTML =
        cart.map(item => {

            const product =
                getProduct(item.id);

            if (!product) return "";

            return `
                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:15px;
                        padding:13px 0;
                        border-bottom:1px solid #e6e2db;
                        font-size:13px;
                    "
                >

                    <span>
                        ${product.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ${formatPrice(
                            product.price *
                            item.quantity
                        )}
                    </strong>

                </div>
            `;

        }).join("");


    const total =
        Cart.total();


    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );


    if (checkoutTotal) {

        const shipping =
            total >= 4999 ? 0 : 199;

        checkoutTotal.textContent =
            formatPrice(
                total + shipping
            );
    }
}


/* ================= PLACE ORDER ================= */

function placeOrder(event) {

    event.preventDefault();

    if (Cart.get().length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    const form =
        event.target;


    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    Cart.clear();


    showToast(
        "Order placed successfully!"
    );


    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 1800);
}


/* ================= LOGIN ================= */

function handleLogin(event) {

    event.preventDefault();

    const form =
        event.target;

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    showToast(
        "Login successful!"
    );


    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 1200);
}


/* ================= REGISTER ================= */

function handleRegister(event) {

    event.preventDefault();

    const form =
        event.target;

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    const password =
        document.getElementById(
            "register-password"
        );

    const confirmPassword =
        document.getElementById(
            "confirm-password"
        );


    if (
        password &&
        confirmPassword &&
        password.value !==
        confirmPassword.value
    ) {

        showToast(
            "Passwords do not match."
        );

        return;
    }


    showToast(
        "Account created successfully!"
    );


    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1200);
}


/* ================= CONTACT ================= */

function handleContact(event) {

    event.preventDefault();

    const form =
        event.target;

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    showToast(
        "Message sent successfully!"
    );


    form.reset();
}


/* ================= SORT PRODUCTS ================= */

function sortProducts(type) {

    const container =
        document.getElementById(
            "shop-products"
        );

    if (!container) return;


    let sorted =
        [...products];


    if (type === "low") {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (type === "high") {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (type === "name") {

        sorted.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    container.innerHTML =
        sorted
            .map(renderProductCard)
            .join("");

}


/* ================= SEARCH ================= */

function searchProducts(value) {

    const query =
        value.toLowerCase().trim();


    const container =
        document.getElementById(
            "shop-products"
        );

    if (!container) return;


    const results =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(query)
        );


    if (results.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <h2>
                    No results
                </h2>

                <p>
                    Try searching for another product.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        results
            .map(renderProductCard)
            .join("");
}


/* ================= CATEGORY FILTER ================= */

function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.category ||
                    "all";


                renderShopProducts(
                    category
                );

            }
        );

    });

}


/* ================= PAGE INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        renderFeaturedProducts();

        renderProductPage();

        renderCart();

        renderCheckout();

        setupCategoryFilters();

    }
);


/* ================= WINDOW EVENTS ================= */

window.addEventListener(
    "storage",
    () => {

        updateCartCount();

        refreshWishlistButtons();

    }
);