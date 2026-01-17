document.getElementById("btn").addEventListener("click",() => {
    document.getElementById("output").textContent = "button clicked";
});


if ("serviceWorker" in navigator) {
    window.addEventListener("load",() => {
    navigator.serviceWorker
      .register("servive-Worker.js")
      .then(() => console.log("service worker registered"))
      .catch(err => console.log("service Worker faild",err));
    });
}