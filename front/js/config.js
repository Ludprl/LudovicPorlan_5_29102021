// Check de l'adresse pour savoir si il faut chercher l'API en local ou sur son adresse d'hébergement.
let apiUrl =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://ocr-p5-kanap.herokuapp.com";
