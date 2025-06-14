let contenedorDeTabla = document.getElementById('s12-tb');
let s12_b2 = document.querySelector("#s12-b2");
let s12_b3 = document.querySelector("#s12-b3");
let s12_ch = document.querySelector("#s12-ch");
let s12_b4 = document.querySelector("#s12-b4");
let s12_b5 = document.querySelector("#s12-b5");
let s12_b8 = document.querySelector("#s12-b8");

// PRUEBA INICIO

// document.querySelector("#st-b2").addEventListener("click", e=>{
//     clearCanva(ctx0);
//     let d = generateSierpinskiVerticesIterative(A, B, C, parseInt(document.querySelector("#st-b1").value));
//     let t = "";
    
//     d.forEach( e =>{
//         t = t + `${e.x},${e.y},${e.d}\n`;
//     });
//     console.log({t, d});
//     document.querySelector("#cr").value = t;
// });

// PRUEBA FIN 

s12_b2.addEventListener("click", gestion);
function drawTriangle() {
    // ctx2.strokeStyle = "red";
    ctx2.strokeStyle = "#0001";
    ctx2.lineWidth = 5; 
    ctx2.beginPath();
    let [cx, cy] = toCanvasCoords(vertices[0][0], vertices[0][1]);
    ctx2.moveTo(cx, cy);    
    vertices.forEach((e)=>{
        [cx, cy] = toCanvasCoords(e[0], e[1]);
        ctx2.lineTo(cx, cy);
    });
    [cx, cy] = toCanvasCoords(vertices[0][0], vertices[0][1]);
    ctx2.lineTo(cx, cy);
    ctx2.stroke();
}
s12_b3.addEventListener("click", () => {
    clearCanva(ctx2);
    document.getElementById("s12-tb").innerHTML = '';
    drawTriangle();
    document.querySelector("#s12-b7").value = "";
    document.querySelector("#s12-b9").value = "";
});
let s12_b6 = document.querySelector("#s12-b6");
s12_b6.addEventListener("click", () => {
    let x = parseFloat(document.querySelector("#s12-b7").value);
    let y = parseFloat(document.querySelector("#s12-b9").value);
    drawPoint(x, y,"brown", 20, ctx2);
});
function crearTablaCoordenadas(listaDeCoordenadas, idDivContenedor) {
    const divContenedor = document.getElementById(idDivContenedor);
    const tabla = document.createElement('table');
    const encabezadoFila = document.createElement('tr');
    const encabezadoX = document.createElement('th');
    encabezadoX.textContent = 'X';
    const encabezadoY = document.createElement('th');
    encabezadoY.textContent = 'Y';
    encabezadoFila.appendChild(encabezadoX);
    encabezadoFila.appendChild(encabezadoY);
  
    tabla.appendChild(encabezadoFila);
    listaDeCoordenadas.forEach(coordenada => {
      const filaDeDatos = document.createElement('tr');
      const celdaX = document.createElement('td');
      celdaX.textContent = coordenada.x.toString().replaceAll(".",",");
      const celdaY = document.createElement('td');
      celdaY.textContent = coordenada.y.toString().replaceAll(".",",");
      filaDeDatos.appendChild(celdaX);
      filaDeDatos.appendChild(celdaY);
      tabla.appendChild(filaDeDatos);
    });
  
    // Limpiar el contenido anterior del div contenedor (si existe)
    divContenedor.innerHTML = '';
    divContenedor.appendChild(tabla);
}

function gestion(){
    if (iteraciones == 0) return 0;
    document.getElementById("s12-tb").innerHTML = '';
    clearCanva(ctx2);
    if (iteraciones<=20) {
        drawTriangle();
        
        drawSierpinski(iteraciones);

        crearTablaCoordenadas(pointList, 's12-tb');
        contenedorDeTabla.classList.add("show");
        s12_b6.style.display = "";
        s12_ch.style.display = "";
        
        contenedorDeTabla.setAttribute("data-pos", "16, 23, 4, 30");
        s12_b2.setAttribute("data-pos","21, 26, 2, 4");
        s12_b3.setAttribute("data-pos","26, 30, 2, 4");
        s12_b4.setAttribute("data-pos","24, 29, 22, 24");
        s12_b5.setAttribute("data-pos","24, 29, 25, 27");
        s12_b8.setAttribute("data-pos","16, 21, 2, 4");
        
    }else{
        clearCanva(ctx2);   
        drawSierpinski(iteraciones);
        // drawTriangle();
        contenedorDeTabla.classList.remove("show");
        s12_b6.style.display = "none";
        s12_ch.style.display = "none";
        contenedorDeTabla.setAttribute("data-pos", "16, 23, 4, 30");
        s12_b8.setAttribute("data-pos","18, 27, 7, 9");
        s12_b2.setAttribute("data-pos","20, 25, 10, 12");
        s12_b3.setAttribute("data-pos","20, 25, 12, 14");
        s12_b4.setAttribute("data-pos","20, 25, 16, 18");
        s12_b5.setAttribute("data-pos","20, 25, 18, 20");
    }
    
    drawOnGrid(contenedorDeTabla);
    drawOnGrid(s12_b2);
    drawOnGrid(s12_b3);
    drawOnGrid(s12_b4);
    drawOnGrid(s12_b5);
    drawOnGrid(s12_b8);
}

s12_b4.addEventListener('click', ()=>{
    // MEDIA
    if ((globalX == globalY) && globalX == 0) return 0;
    drawPoint(globalX, globalY, "blue", 20, ctx2);
});
s12_b5.addEventListener('click', ()=>{
    // MEDIANA
    if ((medianX == medianY) && globalX == 0) return 0;
    drawPoint(medianX, medianY, "red", 20, ctx2);
});