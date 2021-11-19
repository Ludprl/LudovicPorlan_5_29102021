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
    updateCart();
}
main();

function updateCart() {
    const productsInCart = cart.getCart();
    if (productsInCart == null || productsInCart == 0) {
        document.querySelector(
            "#cart__items"
        ).innerHTML = `<p>Votre panier est vide</p>`;
        let formTable = document.querySelector(".cart__order");
        formTable.setAttribute("style", "display:none");
    }
}

function displayCartsProduct() {
    let productsInCart = cart.getCart();
    for (product of productsInCart) {
        document.getElementById(
            "cart__items"
        ).innerHTML += `<article id="cart-item-${product._id}-${product.color}" class="cart__item" data-id="${product._id}" data-color="${product.color}">
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
        </article>`;
    }
}

// On supprime l'element du panier lors du clique sur le bouton "supprimer"
function onDeleteCartItem() {
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            let productId = event.target.getAttribute("data-id");
            let productColor = event.target.getAttribute("data-color");
            let toRemove = document.getElementById(
                "cart-item-" + productId + "-" + productColor
            );
            console.log(toRemove, productColor, productId);
            toRemove.remove();
            cart.remove(productId, productColor);
            updateCart();
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
    productsTotalQuantity.innerHTML = totalQuantity;
    // Affichage du prix total
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
            addressErrorMsg.innerHTML = "Veuillez entrer une adresse valide";
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
                "La ville ne doit comporter que des lettres, des espaces ou des tirets";
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
                "Veuillez saisir une adresse email valide";
            emailErrorMsg.style.color = "orange";
            return;
        } else {
            emailErrorMsg.innerHTML = "";
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
