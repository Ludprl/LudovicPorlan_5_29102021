// On fait du fonctionnel donc on met toutes les variables dans des fonctions.
main();

async function main() {
    // récupération des produits
    const products = await getProducts();
    // Affichage de tout les produits
    for (product of products) {
        displayProduct(product);
    }
}

function getProducts() {
    //récupération des données
    return (
        fetch("http://localhost:3000/api/products")
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
// Affichage d'un seul produit
function displayProduct() {
    document.getElementById(
        "items"
    ).innerHTML += `<a href="product.html?id=${product._id}">
    <article>
        <img src="${product.imageUrl}" alt="Photographie d'un canapé Kanap ${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
    </article>
</a>`;
}
