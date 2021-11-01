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
        fetch(`http://localhost:3000/api/products/${productId}`)
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
}
