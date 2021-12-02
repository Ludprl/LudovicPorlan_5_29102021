// Affichage de la confirmation de commande en retournant l'orderID
(function () {
    let orderid = new URL(location.href).searchParams.get("orderid");
    document.getElementById("orderId").insertAdjacentHTML("beforeend", orderid);
})();
