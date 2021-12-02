// On fait du fonctionnel donc on met toutes les variables dans des fonctions.

// fonction autoappelée
(async function () {
    // récupération des produits
    const products = await getProducts();
    // Affichage de tout les produits
    for (product of products) {
        displayProduct(product);
    }
})();

function getProducts() {
    //récupération des données
    return (
        fetch(apiUrl + "/api/products")
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
function displayProduct() {
    document.getElementById("items").insertAdjacentHTML(
        "beforeend",
        `<a href="product.html?id=${product._id}">
    <article>
        <img src="${product.imageUrl}" alt="Photographie d'un canapé ${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
    </article>
</a>`
    );
}
