class cart {
    // récupérer le contenu du panier
    static getCart() {
        let cart = localStorage.getItem("cart");
        return JSON.parse(cart);
    }

    // supprimer un élèment du panier
    static remove(productId, productColor) {
        let cart = this.getCart();
        cart = cart.filter(
            (p) => !(p._id === productId && p.color === productColor)
        );
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    // modifier les quantités
    static updateQuantity(productId, productColor, productQuantity) {
        let cart = this.getCart();
        cart = cart.map((product) => {
            if (product._id == productId && product.color == productColor)
                product.quantity = productQuantity;
            return product;
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

function main() {
    displayCartsProduct();
    totals();
    onDeleteCartItem();
    onUpdateQuantity();
    checkFormOnSubmit();
}
main();

// Affichage des produits contenu dans le panier.
// Si aucun produit est présent, on informe l'utilisateur et on cache le formulaire de commande.
function displayCartsProduct() {
    let productsInCart = cart.getCart();
    if (productsInCart == null || productsInCart == 0) {
        checkCart();
    } else {
        for (product of productsInCart) {
            document.getElementById("cart__items").insertAdjacentHTML(
                "beforeend",
                `<article id="cart-item-${product._id}-${product.color}" class="cart__item" data-id="${product._id}" data-color="${product.color}">
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
                            <input type="number" data-id="${product._id}" data-color="${product.color}" class="itemQuantity" onchange="onUpdateQuantity()" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <a href="#" class="deleteItem" data-id="${product._id}" data-color="${product.color}">Supprimer</a>
                        </div>
                    </div>
                </div>
            </article>`
            );
        }
    }
}
function checkCart() {
    let productsInCart = cart.getCart();
    if (productsInCart == null || productsInCart == 0) {
        document
            .querySelector("#cart__items")
            .insertAdjacentHTML("beforeend", `<p>Votre panier est vide</p>`);
        document
            .querySelector(".cart__order")
            .setAttribute("style", "display:none");
        localStorage.setItem("cart", JSON.stringify([]));
    }
}

// On supprime l'element du panier lors du clique sur le bouton "supprimer"
// Un message demande confirmation à l'utilisateur
function onDeleteCartItem() {
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            if (
                window.confirm(
                    "Souhaitez-vous supprimer cet article de votre panier ?"
                )
            ) {
                let productId = event.target.getAttribute("data-id");
                let productColor = event.target.getAttribute("data-color");
                let toRemove = document.getElementById(
                    "cart-item-" + productId + "-" + productColor
                );
                toRemove.remove();
                cart.remove(productId, productColor);
                checkCart();
            }
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
            cart.updateQuantity(productId, productColor, productQuantity);
            // Si la quantité saisie est 0 alors on supprime l'article.
            if (productQuantity <= 0) {
                cart.remove(productId, productColor);
                document
                    .getElementById(
                        "cart-item-" + productId + "-" + productColor
                    )
                    .remove();
                displayCartsProduct();
            }
        });
    });
}
// Collect et calcul dynamique des totaux du panier
async function totals() {
    let finalCart = await cart.getCart();
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let i = 0; i < finalCart.length; ++i) {
        totalQuantity += parseInt(finalCart[i].quantity);
        totalPrice +=
            parseFloat(finalCart[i].price) * parseInt(finalCart[i].quantity);
    }
    // Récupération du total des quantités et du prix total
    let productsTotalQuantity = document.getElementById("totalQuantity");
    productsTotalQuantity.innerText = totalQuantity;
    // Affichage du prix total
    let productsTotalPrice = document.getElementById("totalPrice");
    productsTotalPrice.innerText = totalPrice;
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

// Verification du formulaire onSubmit > Passage aux RegExp.
// La fonction s'arrete si un des champ est invalide.
// Sinon postOrder();
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
            firstNameErrorMsg.innerText = "Le champ Prénom est requis";
            return;
        } else if (charRegExp.test(inputName.value) == false) {
            firstNameErrorMsg.innerText = "Veuillez saisir un prénom valide";
            return;
        } else {
            firstNameErrorMsg.innerText = "";
        }
        // vérification du nom
        if (inputLastName.value.trim() == "") {
            let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
            lastNameErrorMsg.innerText = "Le champ Nom est requis";
            return;
        } else if (charRegExp.test(inputLastName.value) == false) {
            lastNameErrorMsg.innerText = "Veuillez saisir un nom valide";
            return;
        } else {
            lastNameErrorMsg.innerText = "";
        }
        // validation de l'adresse
        if (inputAdress.value.trim() == "") {
            let addressErrorMsg = document.getElementById("addressErrorMsg");
            addressErrorMsg.innerText = "Le champ Adresse est requis";
            return;
        } else if (addressRegExp.test(inputAdress.value) == false) {
            addressErrorMsg.innerText = "Veuillez entrer une adresse valide";
            return;
        } else {
            addressErrorMsg.innerText = "";
        }
        // validation de la ville
        if (inputCity.value.trim() == "") {
            let cityErrorMsg = document.getElementById("cityErrorMsg");
            cityErrorMsg.innerText = "Le champ Ville est requis";
            return;
        } else if (charRegExp.test(inputCity.value) == false) {
            cityErrorMsg.innerText = "Veuillez saisir un nom de ville valide";
            return;
        } else {
            cityErrorMsg.innerText = "";
        }
        // validation de l'email
        if (inputMail.value.trim() == "") {
            let emailErrorMsg = document.getElementById("emailErrorMsg");
            emailErrorMsg.innerText = "Le champ Email est requis";
            return;
        } else if (emailRegExp.test(inputMail.value) == false) {
            emailErrorMsg.innerText =
                "Veuillez saisir une adresse email valide";
            return;
        } else {
            emailErrorMsg.innerText = "";
        }
        postOrder();
    });
}
//Envoi des informations client + Panier au localstorage
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
    // récupération des données du panier + fomulaire.
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
            document.location.href =
                "confirmation.html?orderid=" + data.orderId;
        })
        .catch((err) => {
            alert("Problème avec fetch lors de l'envoi de commande");
        });
}
