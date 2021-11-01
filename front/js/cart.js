class cart {
    // récupérer le contenu du panier
    static getCart() {
        let cart = localStorage.getItem("cart");
        return cart != null ? JSON.parse(cart) : [];
    }
    // modifier les quantités
    // supprimer un élèment du panier
    // Enregistrer le panier
    static save(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    // Afficher le panier
}
