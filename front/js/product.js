class cart {
    // récupérer le contenu du panier
    static getCart() {
        let cart = localStorage.getItem("cart");
        return cart != null ? JSON.parse(cart) : [];
    }
    // Ajouter un produit au panier (id, color, qty, price)
    static add(product) {
        let cart = this.getCart();
        let seekProduct = cart.find(
            (p) => p._id == product._id && p.color == product.color
        );
        // Vérification des quantités max et incrémentation si déjà présent
        if (seekProduct != null) {
            seekProduct.quantity += product.quantity;
            if (product.quantity > 100) {
                product.quantity = 100;
            }
        } else {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

(async function () {
    const productId = getProductId();
    const product = await getProduct(productId);
    injectProduct(product);
})();

//on récupere l'id du produit dans le navigateur.
function getProductId() {
    return new URL(location.href).searchParams.get("id");
}

// on effectue un fetch avec l'id du produit
function getProduct(productId) {
    return (
        fetch(apiUrl + "/api/products/" + productId)
            .then(function (httpApiResponse) {
                // transformation de la réponse en Json
                return httpApiResponse.json();
            })
            // on récupere les données dans le then suivant graçe au return dans le then précédent.
            .then(function (products) {
                return products;
            })
            // Alerte en cas d'erreur
            .catch(function (error) {
                alert(error);
            })
    );
}

// On peuple la page avec les informations récupérées
function injectProduct(product) {
    document.title = product.name;
    let item = document.querySelector(".item");
    item.querySelector(".item__img").insertAdjacentHTML(
        "afterbegin",
        `<img src="${product.imageUrl}" alt="Photographie d'un canapé ${product.name}">`
    );
    item.querySelector("#title").insertAdjacentHTML("afterbegin", product.name);
    item.querySelector("#price").insertAdjacentHTML(
        "afterbegin",
        product.price
    );
    item.querySelector("#description").insertAdjacentHTML(
        "afterbegin",
        product.description
    );
    item.querySelector("#colors").insertAdjacentHTML(
        "beforeend",
        product.colors
            .map((color) => `<option value="${color}">${color}</option>`)
            .join()
    );
    // Ajout obligation de choisir une couleur.
    let colorDropdownMenu = document.querySelector("#colors");
    colorDropdownMenu.setAttribute("required", "");
    // Ajout au panier en vérifiant les saisies de l'utilisateur.
    document.querySelector("#addToCart").addEventListener("click", function () {
        if (
            document.querySelector("#quantity").reportValidity() &&
            document.querySelector("#colors").reportValidity()
        ) {
            product.quantity = parseInt(
                document.querySelector("#quantity").value
            );
            product.color = document.querySelector("#colors").value;
            cart.add(product);
            window.location.assign("cart.html");
        }
    });
}
