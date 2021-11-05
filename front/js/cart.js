class cart {
    // récupérer le contenu du panier
    static getCart() {
        let cart = localStorage.getItem("cart");
        return cart != null ? JSON.parse(cart) : [];
    }
    // modifier les quantités
    // supprimer un élèment du panier
    static remove(productId, productColor) {
        let cart = this.getCart();
        cart = cart.filter(
            (p) => p._id == productId && p.color == productColor
        );
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static updateQuantity(productId, productQuantity) {
        let cart = this.getCart();
        cart = cart.map((p) => {
            if (p._id == productId) p.quantity = productQuantity;
            return p;
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        //if (productQuantity <= 0) self::remove();
    }
}

(async function () {
    // récupération des produits du panier
    const productsInCart = await cart.getCart();
    // Affichage de tout les produits contenu dans le panier
    for (product of productsInCart) {
        displayCartsProduct(product);
    }
    onDeleteCartItem();
    onUpdateQuantity();
})();

function displayCartsProduct() {
    document.getElementById(
        "cart__items"
    ).innerHTML += `<article id="cart-item-${product._id}" class="cart__item" data-id="${product._id}" data-color="${product.color}">
    <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="Photographie d'un canapé ${product.name}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
            <h2>${product.name}</h2>
            <p>${product.price} €</p>
            <p>${product.color}</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" data-id="${product._id}" class="itemQuantity" onchange="onUpdateQuantity()" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <a href="#" class="deleteItem" data-id="${product._id}" data-color="${product.color}">Supprimer</a>
            </div>
        </div>
    </div>
</article>`;
}

function onDeleteCartItem() {
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-id");
            const productColor = event.target.getAttribute("data-color");
            event.preventDefault();
            cart.remove(productId, productColor);
            document.getElementById("cart-item-" + productId).remove();
        });
    });
}
function onUpdateQuantity() {
    document.querySelectorAll(".itemQuantity").forEach((item) => {
        item.addEventListener("change", (event) => {
            const productId = event.target.getAttribute("data-id");
            const productQuantity = event.target.value;
            console.log(productQuantity);
            event.preventDefault();
            cart.updateQuantity(productId, productQuantity);
            if (productQuantity <= 0)
                document.getElementById("cart-item-" + productId).remove();
        });
    });
}
