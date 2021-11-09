class cart {
    // récupérer le contenu du panier
    static getCart() {
        let cart = localStorage.getItem("cart");
        return cart != null ? JSON.parse(cart) : [];
    }
    // supprimer un élèment du panier
    static remove(productId, productColor) {
        let cart = this.getCart();
        cart = cart.filter(
            (p) => p._id !== productId && p.color !== productColor
        );
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    // modifier les quantités
    static updateQuantity(productId, productQuantity) {
        let cart = this.getCart();
        cart = cart.map((p) => {
            if (p._id == productId) p.quantity = productQuantity;
            return p;
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

(async function () {
    // récupération des produits du panier
    const productsInCart = await cart.getCart();
    // Affichage de tout les produits contenu dans le panier
    if (productsInCart === null || productsInCart == 0) {
        document.querySelector(
            "#cart__items"
        ).innerHTML = `<p>Votre panier est vide</p>`;
    } else {
        for (product of productsInCart) {
            displayCartsProduct(product);
        }
    }
    onDeleteCartItem();
    onUpdateQuantity();
    totals();
    checkFormOnSubmit();
})();
// Affichage du panier
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
// On supprime l'element du panier lors du clique sur le bouton "supprimer"
function onDeleteCartItem() {
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-id");
            const productColor = event.target.getAttribute("data-color");
            event.preventDefault();
            cart.remove(productId, productColor);
            document.getElementById("cart-item-" + productId).remove();
            totals();
        });
    });
}
// mise à jour de la quantité lors du changement de valeur dans l'input.
function onUpdateQuantity() {
    document.querySelectorAll(".itemQuantity").forEach((item) => {
        item.addEventListener("change", (event) => {
            const productId = event.target.getAttribute("data-id");
            const productColor = event.target.getAttribute("data-color");
            const productQuantity = event.target.value;
            event.preventDefault();
            cart.updateQuantity(productId, productQuantity);
            // Si la quantité saisie est 0 alors on supprime l'article.
            if (productQuantity <= 0) {
                cart.remove(productId, productColor);
                document.getElementById("cart-item-" + productId).remove();
            }
        });
    });
}
function totals() {
    let finalCart = cart.getCart();
    // Récupération du total des quantités
    let totalProductsInCart = document.getElementsByClassName("itemQuantity");
    let customerLength = totalProductsInCart.length,
        totalQtt = 0;
    for (let i = 0; i < customerLength; ++i) {
        totalQtt += totalProductsInCart[i].valueAsNumber;
    }
    let productsTotalQuantity = document.getElementById("totalQuantity");
    productsTotalQuantity.innerHTML = totalQtt;
    // Récupération du prix total
    totalPrice = 0;
    for (let i = 0; i < customerLength; ++i) {
        totalPrice += totalProductsInCart[i].valueAsNumber * finalCart[i].price;
    }
    let productsTotalPrice = document.getElementById("totalPrice");
    productsTotalPrice.innerHTML = totalPrice;
    // Mise à jour prix total si changement de quantité ou suppression d'un produit
    document.querySelectorAll(".itemQuantity").forEach((item) => {
        item.addEventListener("change", (event) => {
            totals();
        });
    });
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            totals();
        });
    });
}

function checkFormOnSubmit() {
    const orderBouton = document.getElementById("order");
    orderBouton.addEventListener("click", (event) => {
        event.preventDefault();
        const productsInCart = cart.getCart();
        let inputName = document.getElementById("firstName");
        let inputLastName = document.getElementById("lastName");
        let inputAdress = document.getElementById("address");
        let inputCity = document.getElementById("city");
        let inputMail = document.getElementById("email");

        //Déclaration des RegExp
        let emailRegExp = new RegExp(
            "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
        );
        let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
        let addressRegExp = new RegExp(
            "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
        );
        // vérification du prénom
        if (inputName.value.trim() == "") {
            let firstNameErrorMsg =
                document.getElementById("firstNameErrorMsg");
            firstNameErrorMsg.innerHTML = "Le champ Prénom est requis";
            firstNameErrorMsg.style.color = "red";
            return;
        } else if (charRegExp.test(inputName.value) == false) {
            firstNameErrorMsg.innerHTML =
                "Le prénom ne doit comporter que des lettres, des espaces ou des tirets";
            firstNameErrorMsg.style.color = "orange";
            return;
        } else {
            firstNameErrorMsg.innerHTML = "";
        }
        // vérification du nom
        if (inputLastName.value.trim() == "") {
            let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
            lastNameErrorMsg.innerHTML = "Le champ Nom est requis";
            lastNameErrorMsg.style.color = "red";
            return;
        } else if (charRegExp.test(inputLastName.value) == false) {
            lastNameErrorMsg.innerHTML =
                "Le Nom ne doit comporter que des lettres, des espaces ou des tirets";
            lastNameErrorMsg.style.color = "orange";
            return;
        } else {
            lastNameErrorMsg.innerHTML = "";
        }
        // validation de l'adresse
        if (inputAdress.value.trim() == "") {
            let addressErrorMsg = document.getElementById("addressErrorMsg");
            addressErrorMsg.innerHTML = "Le champ Adresse est requis";
            addressErrorMsg.style.color = "red";
            return;
        } else if (addressRegExp.test(inputAdress.value) == false) {
            addressErrorMsg.innerHTML =
                "Le Nom ne doit comporter que des lettres, des espaces ou des tirets";
            addressErrorMsg.style.color = "orange";
            return;
        } else {
            addressErrorMsg.innerHTML = "";
        }
        // validation de la ville
        if (inputCity.value.trim() == "") {
            let cityErrorMsg = document.getElementById("cityErrorMsg");
            cityErrorMsg.innerHTML = "Le champ Ville est requis";
            cityErrorMsg.style.color = "red";
            return;
        } else if (charRegExp.test(inputCity.value) == false) {
            cityErrorMsg.innerHTML =
                "Le Nom ne doit comporter que des lettres, des espaces ou des tirets";
            cityErrorMsg.style.color = "orange";
            return;
        } else {
            cityErrorMsg.innerHTML = "";
        }
        // validation de l'email
        if (inputMail.value.trim() == "") {
            let emailErrorMsg = document.getElementById("emailErrorMsg");
            emailErrorMsg.innerHTML = "Le champ Email est requis";
            emailErrorMsg.style.color = "red";
            return;
        } else if (emailRegExp.test(inputMail.value) == false) {
            emailErrorMsg.innerHTML =
                "Le Nom ne doit comporter que des lettres, des espaces ou des tirets";
            emailErrorMsg.style.color = "orange";
            return;
        } else {
            emailErrorMsg.innerHTML = "";
        }
        if (productsInCart === null || productsInCart == 0) {
            return;
        }
        postOrder();
    });
}
//Envoi des informations client au localstorage
function postOrder() {
    let finalCart = cart.getCart();
    //Récupération des informations client
    let inputName = document.getElementById("firstName");
    let inputLastName = document.getElementById("lastName");
    let inputAdress = document.getElementById("address");
    let inputCity = document.getElementById("city");
    let inputMail = document.getElementById("email");
    //récupération en dans Array des ID produits du panier
    let productsId = finalCart.map((product) => product._id);
    console.log(productsId);
    // récupération des données
    const customerOrder = {
        contact: {
            firstName: inputName.value,
            lastName: inputLastName.value,
            address: inputAdress.value,
            city: inputCity.value,
            email: inputMail.value,
        },
        products: productsId,
    };
    //Construction de la requete POST
    const dataToApi = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customerOrder),
    };
    fetch(apiUrl + "/api/products/order", dataToApi)
        .then((response) => response.json())
        .then(function (data) {
            localStorage.clear();
            localStorage.setItem("orderId", data.orderId);
            document.location.href = "confirmation.html";
        })
        .catch((err) => {
            alert("Problème avec fetch lors de l'envoi de commande");
        });
}
