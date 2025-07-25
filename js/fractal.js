/** PROBAR CON 6, 50, 100, 1000, 9000,50000, 100000, 500000, 1000000*/
// const canvas0 = document.getElementById("sierpinski0");
// const ctx0 = canvas0.getContext("2d");

const canvas2 = document.getElementById("sierpinski2");
const ctx2 = canvas2.getContext("2d");
const width = canvas2.width;
const height = canvas2.height;
let pointList;
let globalX = 0;
let globalY = 0;
let medianX = 0;
let medianY = 0;

const startAngle = 0;
const endAngle = 2 * Math.PI;

let point = [0, 0];
let lastPointPainted = { x: 0, y: 0 };

const scale = 1400;
const offsetX = width / 2;
const offsetY = height * 0.9;
const A = [-1, 0];
const B = [1, 0];
const C = [0, Math.sqrt(3)];
let vertices = [A, B, C];

// PUEBA INICIO 
// function generateSierpinskiVerticesIterative(A, B, C, depth) {
//   let pList0 = [];
//   // Initialize with the first triangle's vertices
//   let currentTriangles = [
//     [A, B, C]
//   ];

//   // Helper function to calculate the midpoint between two points
//   function getMidpoint(p1, p2) {
//     return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
//   }

//   // Iterate for the specified depth
//   for (let i = 0; i < depth; i++) {
//     let nextTriangles = [];
//     for (const triangle of currentTriangles) {
//       const [p1, p2, p3] = triangle;

//       // Calculate midpoints of the current triangle's sides
//       const m1 = getMidpoint(p1, p2);
//       const m2 = getMidpoint(p2, p3);
//       const m3 = getMidpoint(p3, p1);

//       // Add the three new outer triangles to the next iteration's list
//       nextTriangles.push(
//         [p1, m1, m3], // Top-left triangle
//         [m1, p2, m2], // Top-right triangle
//         [m3, m2, p3] // Bottom triangle
//       );
//     }
//     currentTriangles = nextTriangles;
//   }

//   // After all iterations, currentTriangles contains all the smallest triangles.
//   // Extract all unique vertices from these triangles.
//   const allVertices = [];
//   for (const triangle of currentTriangles) {
//     allVertices.push(...triangle);
//   }

//   // Remove duplicate vertices.
//   // Convert each coordinate array to a JSON string to use Set for uniqueness,
//   // then parse back to arrays.
//   const uniqueVertices = Array.from(new Set(allVertices.map(v => JSON.stringify(v)))).map(v => JSON.parse(v));

//   // pList0 = uniqueVertices; // Assign the unique vertices to pList0
//   // return pList0;
//   let nCho = [];
//   uniqueVertices.forEach((e, i)=>{
//     nCho.push({x: e[0],y:e[1],d: Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2))});
//     drawPoint(e[0], e[1], "black", 15, ctx0);
//     console.log(nCho[i].x,nCho[i].y,nCho[i].d);
    
// });
// return nCho;
// }

// PRUEBA FIN


function toCanvasCoords(x, y) {
  return [x * scale + offsetX, -y * scale + offsetY];
}

function drawPoint(x, y, color, size, altenativeCtx) {
  
  if (altenativeCtx) {
    ctx = altenativeCtx;
  }

  const [cx, cy] = toCanvasCoords(x, y);
  ctx.fillStyle = color ?? "black";
  const radius = size;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.fill();
}

function drawSierpinski(iterations) {
  if (iterations == 0) {
    return 0;
  }
  let sizeBK = 10;
  if (iteraciones > 0) sizeBK = 40;
  if (iteraciones >= 20) sizeBK = 30;
  if (iteraciones >= 50) sizeBK = 20;
  if (iteraciones >= 100) sizeBK = 15;
  if (iteraciones >= 1000) sizeBK = 10;
  if (iteraciones >= 10000) sizeBK = 5;
  if (iteraciones >= 100000) sizeBK = 1;
  let pList = [];

  let xCoordinates = [];
  let yCoordinates = [];

  for (let i = 0; i < iterations; i++) {
    
    let currentVertexIndex = Math.floor(Math.random() * 3);
    const target = vertices[currentVertexIndex];
    point = [(point[0] + target[0]) / 2, (point[1] + target[1]) / 2];
    let p = { x: point[0], y: point[1] };
    globalX = globalX + point[0];  
    globalY = globalY + point[1];  
    pList.push(p);
    xCoordinates.push(p.x);
    yCoordinates.push(p.y);
    drawPoint(p.x, p.y, "black", sizeBK, ctx2);
    
  }
  globalX = globalX / iterations;
  globalY = globalY / iterations;

  const sortedX = [...xCoordinates].sort((a, b) => a - b);
 
  const middleX = Math.floor(iterations / 2);
  if (iterations % 2 === 0) {
    medianX = (sortedX[middleX - 1] + sortedX[middleX]) / 2;
  } else {
    medianX = sortedX[middleX];
  }

  // Calcular la mediana de las coordenadas Y
  const sortedY = [...yCoordinates].sort((a, b) => a - b);
  const middleY = Math.floor(iterations / 2);
  if (iterations % 2 === 0) {
    medianY = (sortedY[middleY - 1] + sortedY[middleY]) / 2;
  } else {
    medianY = sortedY[middleY];
  }


  pointList = JSON.parse(JSON.stringify(pList));
}

function clearCanva(altenativeCtx /*, drawVx=true*/) {
  altenativeCtx.clearRect(0, 0, canvas2.width, canvas2.height);
}
