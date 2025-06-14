
let currentSlideIndex = 0;
function drawOnGrid(el) {
  let pos = el.dataset.pos.split(",").map((e) => parseInt(e.trim()));
  el.style.gridColumn = `${pos[0]} / ${pos[1]}`;
  el.style.gridRow = `${pos[2]} / ${pos[3]}`;
}
function drawImg(el) {
  let link = el.dataset.link;
  el.style.backgroundImage = "Url(" + link + ")";
}
function btn(slideIndexAdd) {
  let nextSlideIndex = currentSlideIndex + slideIndexAdd;
  let dataSlides = document.querySelectorAll("[data-slide]");
  let minSildeIndex = 1;
  let maxSildeIndex = parseInt(dataSlides[dataSlides.length - 1].dataset.slide);
    currentSlideIndex = nextSlideIndex;
  if (!(nextSlideIndex >= minSildeIndex && nextSlideIndex <= maxSildeIndex))
    return;
  if (nextSlideIndex == minSildeIndex)
    document.querySelector("[data-btn-anterior]").style.display = "none";
  if (!(nextSlideIndex == minSildeIndex))
    document.querySelector("[data-btn-anterior]").style.display = "flex";
  if (nextSlideIndex == maxSildeIndex)
    document.querySelector("[data-btn-siguiente]").style.display = "none";
  if (!(nextSlideIndex == maxSildeIndex))
    document.querySelector("[data-btn-siguiente]").style.display = "flex";
  dataSlides.forEach((e) => {
    e.classList.remove("show");
  });
  dataSlides = document.querySelectorAll('[data-slide="' + nextSlideIndex + '"]');
  dataSlides.forEach((e) => { e.classList.add("show") });
}
let dataChangers = document.querySelectorAll("[data-changer]");
dataChangers.forEach((e) => drawOnGrid(e));
let dataImgs = document.querySelectorAll("[data-img]");
dataImgs.forEach((e) => drawImg(e));
document.getElementById("slide-anterior").addEventListener("click", () => btn(-1));
document.getElementById("slide-siguiente").addEventListener("click", () => btn(1));
let dataSlides = document.querySelectorAll("[data-slide]");
let maxSildeIndex = parseInt(dataSlides[dataSlides.length - 1].dataset.slide);
function close() {
    let dataBtnOpenDefs = document.querySelectorAll("[data-btn-open-def]");
    dataBtnOpenDefs.forEach((el) => {
      el.addEventListener("click", () => (document.getElementById(el.dataset.btnOpenDef).style.display = "flex"));
    });
    let dataBtnCloseDefs = document.querySelectorAll("[data-btn-close-def]");
    dataBtnCloseDefs.forEach((el) => {
      el.addEventListener("click", () => (document.getElementById(el.dataset.btnCloseDef).style.display = "none"));
  });
}
close();
//--------------------------------------
// function configurarEventos() {
//   // Eventos para teclado
//   document.addEventListener('keydown', function(event) {
//     if (event.key === 'ArrowLeft') {
//       btn(-1);
//     } else if (event.key === 'ArrowRight') {
//       btn(1);
//     }
//   });
//     // Eventos para dispositivos táctiles
//   let touchStartX = 0;
//   document.addEventListener('touchstart', function(event) {
//     touchStartX = event.changedTouches[0].screenX;
//   }, false);
//     document.addEventListener('touchend', function(event) {
//     if (!touchStartX) return;
//         const touchEndX = event.changedTouches[0].screenX;
//     const deltaX = touchEndX - touchStartX;
//         // Considera una sensibilidad para el deslizamiento
//     const sensibilidad = 50;
//         if (deltaX > sensibilidad) {
//       // Deslizamiento a la derecha
//       btn(1);
//     } else if (deltaX < -sensibilidad) {
//       // Deslizamiento a la izquierda
//       btn(-1);
//     }
//         // Reinicia el valor inicial
//     touchStartX = 0;
//   }, false);
// }
// document.addEventListener('DOMContentLoaded', configurarEventos);
//--------------------------------------

let iteraciones = 0;
document.querySelector("#s12-b1").addEventListener("change", (e)=>{
  iteraciones = parseInt(e.target.value);
  if (e.target.value > 500000) {
    if (e.target.value <= 1000000){
      let validate = confirm("Estas intentando generar más de medio millón de puntos, esto podria detener tu navegador temporalmente. ¿Deseas continuar?");
      if (!validate) { e.target.value = 500000; }
    }else{
      e.target.value = 1000000;
      alert("Estas intentando generar más de millón de puntos se ha limitado el número para evitar que la página se detenga.");
    }
  }
  // if (e.target.value > 20) { e.target.value = 20; }
  if (e.target.value < 0) { e.target.value = 0; }
  iteraciones = parseInt(e.target.value);

});
    
btn(1);
