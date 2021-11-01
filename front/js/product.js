(async function () {
    const productId = getProductId();
    console.log(productId);
    const product = getProduct(productId);
    injectProduct(product);
})();

function getProductId() {
    return new URL(location.href).searchParams.get("id");
}

function getProduct(productId) {
    return "";
}
function injectProduct(product) {}
