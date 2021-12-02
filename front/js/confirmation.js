(function () {
    let orderid = new URL(location.href).searchParams.get("orderid");
    document.getElementById("orderId").insertAdjacentHTML("beforeend", orderid);
})();
