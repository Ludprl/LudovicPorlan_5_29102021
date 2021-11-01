class cart {
    // récupérer le contenu du panier
    static getCart() {
        let cart = localStorage.getItem("cart");
        return cart != null ? JSON.parse(cart) : [];
    }
    // modifier les quantités
    // supprimer un élèment du panier
    static remove(product) {
        let cart = this.getCart();
        let seekProduct = cart.find(
            (p) => p._id == product._id && p.color == product.color
        );
        // Vérification des quantités max et décrémentation si déjà présent
        if (seekProduct != null) {
            seekProduct.quantity = --product.quantity;
            if ((product.quantity = 0)) {
                // Retirer l'item du localstorage !!!!!!
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

(async function () {
    // récupération des produits du panier
    const productsInCart = await cart.getCart();
    // Affichage de tout les produits contenu dans le panier
    for (product of productsInCart) {
        displayCartsProduct(product);
    }
})();

function displayCartsProduct() {
    document.getElementById(
        "cart__items"
    ).innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
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
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem" id="[item_Id]">Supprimer</p>
            </div>
        </div>
    </div>
</article>`;

    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            cart.remove(product);
            window.location.assign("cart.html");
        });
    });
}
