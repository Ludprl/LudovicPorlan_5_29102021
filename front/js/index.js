// On fait du fonctionnel donc on met toutes les variables dans des fonctions.
main();

function main() {
    // récupération des produits
    const products = getProducts();
    // Affichage de tout les produits
    displayAllProducts(products);
}

function getProducts() {
    //récupération des données
    fetch("http://localhost:3000/api/products")
        .then(function (httpApiResponse) {
            // transformation de la réponse en Json
            return httpApiResponse.json();
        })
        // on récupere les données dans le then suivant graçe au return dans le then précédent.
        .then(function (products) {
            console.log(products);
        });
}

function displayAllProducts() {
    return "";
}
