        // Obtención de referencias al canvas y su contexto de dibujo
        const canvas = document.getElementById('sierpinskiCanvas');
        let ctx = canvas.getContext('2d');

        // Obtención de referencias a los botones
        const clearButton = document.getElementById('clearButton');
        // const drawFlagButton = document.getElementById('drawFlagButton');

        // Variable global para almacenar la información de los puntos del fractal
        // Formato: {x: coordenadaX, y: coordenadaY, d: distanciaAlOrigen}
        let listadoInfo = [];
        // Almacena los vértices del fractal de Sierpinski para evitar recalculaciones
        let sierpinskiVertices = [];
        // Almacena las posiciones de las banderas dibujadas para poder limpiarlas
        let drawnFlags = [];

        // Variable de configuración para ajustar estilos y parámetros
        const config = {
            pointRadius: 50,             // Radio de los puntos
            pointFillColor: '#4CAF5030',  // Color de relleno de los puntos (verde)
            pointBorderColor: '#2E7D32', // Color del borde de los puntos (verde oscuro)
            pointBorderWidth: 10,        // Ancho del borde de los puntos
            flagPoleWidth: 30,           // Ancho del mástil de la bandera
            flagPoleHeight: 300,         // Altura del mástil de la bandera
            flagColor: '#FF0000',       // Color de la bandera (rojo)
            flagTriangleSide: 100,       // Lado del triángulo equilátero de la bandera
            flagPoleColor: '#8D6E63',   // Color del mástil (marrón)
            textColor: '#333333',       // Color del texto de las coordenadas
            textSize: 80,               // Tamaño del texto de las coordenadas
            maxIterations: 2,           // Número de iteraciones para el fractal de Sierpinski
            originShiftY: 300,          // Desplazamiento del origen hacia arriba en el canvas (en píxeles)
            distanceTextColor: '#0000FF' // Color del texto de la distancia (azul)
        };

        // --- Funciones Auxiliares para Conversión de Coordenadas ---

        /**
         * Convierte coordenadas del espacio del problema (matemáticas) a coordenadas del canvas.
         * El origen del problema (0,0) se mapea al centro horizontal y al fondo de la base del triángulo en el canvas,
         * con un desplazamiento vertical hacia arriba.
         * @param {number} px - Coordenada X del problema.
         * @param {number} py - Coordenada Y del problema.
         * @returns {{x: number, y: number}} - Objeto con coordenadas (cx, cy) del canvas.
         */
        function problemToCanvas(px, py) {
            // Desplaza X: -1500 del problema se convierte en 0 en el canvas, 1500 en 3000.
            const cx = px + canvas.width / 2;
            // Invierte Y: 0 del problema (base) se convierte en la parte inferior del canvas,
            // y luego se aplica el desplazamiento hacia arriba.
            const cy = canvas.height - py - config.originShiftY;
            return { x: cx, y: cy };
        }

        /**
         * Convierte coordenadas del canvas a coordenadas del espacio del problema.
         * @param {number} cx - Coordenada X del canvas.
         * @param {number} cy - Coordenada Y del canvas.
         * @returns {{x: number, y: number}} - Objeto con coordenadas (px, py) del problema.
         */
        function canvasToProblem(cx, cy) {
            const px = cx - canvas.width / 2;
            const py = canvas.height - (cy + config.originShiftY);
            return { x: px, y: py };
        }

        // --- Función para Formatear Números ---

        /**
         * Formatea un número para mostrarlo con un máximo de dos decimales.
         * Si el número tiene cero o dos decimales, se muestran así.
         * Si tiene más de dos, se recorta a dos. Si es un entero (ej. 100), se muestra sin decimales.
         * @param {number} value - El número a formatear.
         * @returns {string} - El número formateado como texto.
         */
        function formatCoordinate(value) {
            const fixedValue = value.toFixed(2); // Convierte a string con 2 decimales (ej. "100.00", "100.34")
            // Si termina en ".00", lo convertimos a entero para eliminar los decimales
            if (fixedValue.endsWith('.00')) {
                return parseInt(fixedValue).toString(); // "100.00" -> 100 -> "100"
            }
            return fixedValue; // Retorna el valor con 2 decimales (ej. "100.34")
        }

        // --- Generación del Fractal de Sierpinski ---

        /**
         * Calcula el tercer vértice de un triángulo equilátero dadas dos bases.
         * Se asume que el tercer vértice está "arriba" o en la dirección positiva del eje Y
         * con respecto a la base p1-p2.
         * @param {{x: number, y: number}} p1 - Primer vértice de la base.
         * @param {{x: number, y: number}} p2 - Segundo vértice de la base.
         * @returns {{x: number, y: number}} - El tercer vértice del triángulo equilátero.
         */
        function getEquilateralThirdVertex(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            // Rotación de 60 grados para encontrar el tercer vértice
            const thirdX = p1.x + (dx * 0.5) - (dy * Math.sqrt(3) * 0.5);
            const thirdY = p1.y + (dy * 0.5) + (dx * Math.sqrt(3) * 0.5);
            return { x: thirdX, y: thirdY };
        }

        /**
         * Genera recursivamente los vértices del fractal de Sierpinski.
         * Los vértices de los triángulos "externos" se añaden a la lista.
         * @param {{x: number, y: number}} p1 - Primer vértice del triángulo actual.
         * @param {{x: number, y: number}} p2 - Segundo vértice del triángulo actual.
         * @param {{x: number, y: number}} p3 - Tercer vértice del triángulo actual.
         * @param {number} currentIteration - Iteración actual.
         * @param {number} maxIterations - Número máximo de iteraciones.
         * @param {Array<{x: number, y: number}>} allVertices - Array para almacenar todos los vértices únicos.
         */
        function generateSierpinskiVertices(p1, p2, p3, currentIteration, maxIterations, allVertices) {
            // Caso base: si se ha alcanzado la iteración máxima, añadir los vértices del triángulo actual
            if (currentIteration === maxIterations) {
                addUniqueVertex(p1, allVertices);
                addUniqueVertex(p2, allVertices);
                addUniqueVertex(p3, allVertices);
                return;
            }

            // Calcular los puntos medios de los lados del triángulo actual
            const p12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
            const p23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
            const p31 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

            // Llamadas recursivas para los tres triángulos "externos"
            generateSierpinskiVertices(p1, p12, p31, currentIteration + 1, maxIterations, allVertices);
            generateSierpinskiVertices(p12, p2, p23, currentIteration + 1, maxIterations, allVertices);
            generateSierpinskiVertices(p31, p23, p3, currentIteration + 1, maxIterations, allVertices);
        }

        /**
         * Añade un vértice a la lista de vértices únicos si no está ya presente,
         * y calcula su distancia al origen (0,0).
         * @param {{x: number, y: number}} point - El vértice a añadir.
         * @param {Array<{x: number, y: number, d: number}>} allVertices - El array donde se almacenan los vértices.
         */
        function addUniqueVertex(point, allVertices) {
            // Redondear coordenadas para manejar problemas de precisión de punto flotante al verificar unicidad
            const roundedX = parseFloat(point.x.toFixed(6)); // Se mantiene 6 decimales para precisión interna
            const roundedY = parseFloat(point.y.toFixed(6)); // Se mantiene 6 decimales para precisión interna

            const existing = allVertices.find(v => v.x === roundedX && v.y === roundedY);
            if (!existing) {
                const d = Math.sqrt(roundedX * roundedX + roundedY * roundedY);
                listadoInfo.push({ x: roundedX, y: roundedY, d: parseFloat(d.toFixed(2)) }); // Distancia 'd' a 2 decimales
                allVertices.push({ x: roundedX, y: roundedY, d: parseFloat(d.toFixed(2)) }); // Para la lista de vértices
            }
        }

        // --- Funciones de Dibujo ---

        /**
         * Dibuja un único punto en el canvas con los estilos definidos en la configuración.
         * @param {{x: number, y: number}} point - El punto a dibujar (en coordenadas del problema).
         */
        function drawPointFlag(point) {
            const { x: cx, y: cy } = problemToCanvas(point.x, point.y);
            ctx.beginPath();
            ctx.arc(cx, cy, config.pointRadius, 0, Math.PI * 2); // Dibuja un círculo
            ctx.fillStyle = config.pointFillColor; // Color de relleno
            ctx.fill();
            ctx.strokeStyle = config.pointBorderColor; // Color del borde
            ctx.lineWidth = config.pointBorderWidth; // Ancho del borde
            ctx.stroke();
        }

        /**
         * Dibuja el texto de las coordenadas y la distancia al origen junto a un punto.
         * @param {{x: number, y: number, d: number}} point - El punto cuya información se va a mostrar.
         */
        function drawPointText(point) {
            const { x: cx, y: cy } = problemToCanvas(point.x, point.y);
            ctx.font = `${config.textSize}px Inter`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            // Formatear x e y usando la nueva función para mostrar máximo 2 decimales o enteros
            const formattedX = formatCoordinate(point.x);
            const formattedY = formatCoordinate(point.y);

            // Dibujar las coordenadas (x,y)
            ctx.fillStyle = config.textColor;
            const coordsText = `(${formattedX}, ${formattedY})`;
            ctx.fillText(coordsText, cx + config.pointRadius + 5, cy - config.textSize / 2); // Un poco más arriba

            // Dibujar la distancia 'd' en una nueva línea y en color azul
            ctx.fillStyle = config.distanceTextColor; // Color azul para la distancia
            const distanceText = `${point.d}`;
            ctx.fillText(distanceText, cx + config.pointRadius + 5, cy + config.textSize / 2); // Un poco más abajo
        }

        /**
         * Dibuja un pequeño marcador con forma de bandera roja en las coordenadas especificadas.
         * @param {number} px - Coordenada X del problema donde se dibujará la bandera.
         * @param {number} py - Coordenada Y del problema donde se dibujará la bandera.
         */
        function drawFlag(px, py) {
            const { x: cx, y: cy } = problemToCanvas(px, py);

            // Dibujar el mástil (línea vertical marrón)
            ctx.fillStyle = config.flagPoleColor;
            ctx.fillRect(cx - config.flagPoleWidth / 2, cy - config.flagPoleHeight, config.flagPoleWidth, config.flagPoleHeight);

            // Dibujar la bandera (triángulo equilátero rojo)
            ctx.fillStyle = config.flagColor;
            const flagBaseX = cx + config.flagPoleWidth / 2; // Base de la bandera pegada al mástil
            const flagBaseY = cy - config.flagPoleHeight; // Parte superior del mástil

            ctx.beginPath();
            ctx.moveTo(flagBaseX, flagBaseY); // Punto superior-izquierdo del triángulo
            // Punto derecho (punta del triángulo)
            ctx.lineTo(flagBaseX + config.flagTriangleSide, flagBaseY + config.flagTriangleSide / 2);
            // Punto inferior-izquierdo del triángulo
            ctx.lineTo(flagBaseX, flagBaseY + config.flagTriangleSide);
            ctx.closePath();
            ctx.fill();

            // Almacenar la posición de la bandera para la función de limpiar
            drawnFlags.push({ x: px, y: py });
        }

        // --- Interacción del Canvas ---

        /**
         * Obtiene la posición del ratón en coordenadas del problema.
         * @param {HTMLCanvasElement} canvas - El elemento canvas.
         * @param {MouseEvent} event - El evento del ratón.
         * @returns {{x: number, y: number}} - Objeto con coordenadas (x, y) del problema.
         */
        function getMousePos(canvas, event) {
            const rect = canvas.getBoundingClientRect(); // Obtiene el tamaño y posición del canvas en la ventana
            // Calcula la escala si el canvas se ha redimensionado con CSS
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            // Coordenadas del ratón relativas al canvas (en píxeles reales del canvas)
            const canvasX = (event.clientX - rect.left) * scaleX;
            const canvasY = (event.clientY - rect.top) * scaleY;

            // Convierte las coordenadas del canvas a coordenadas del problema
            return canvasToProblem(canvasX, canvasY);
        }

                function calcularDistancia(punto1, punto2) {
        const dx = punto2.x - punto1.x; // Diferencia en x
        const dy = punto2.y - punto1.y; // Diferencia en y
        return Math.sqrt(dx * dx + dy * dy); // Raíz cuadrada de la suma de cuadrados
        }
        /**
         * Manejador de evento para el movimiento del ratón sobre el canvas.
         * Detecta si el ratón está sobre un punto y lo registra en la consola.
         * @param {MouseEvent} event - El evento de movimiento del ratón.
         */
        function handleMouseMove(event) {
            const mouseProblemPos = getMousePos(canvas, event); // Posición del ratón en coordenadas del problema
            let pointDetected = false;
            // Iterar sobre todos los puntos del fractal
            for (const point of listadoInfo) {
                const { x: cx, y: cy } = problemToCanvas(point.x, point.y); // Convertir punto a coordenadas del canvas
                // Calcular la distancia entre la posición del ratón en el canvas y el centro del punto
                
                // const distance = Math.sqrt(
                //     Math.pow(event.offsetX - cx, 2) + // event.offsetX/Y son relativas al canvas
                //     Math.pow(event.offsetY - cy, 2)
                // );
                const distance = calcularDistancia(mouseProblemPos, point)
                // const distance = Math.sqrt(
                //     Math.pow(point.x, 2) + // event.offsetX/Y son relativas al canvas
                //     Math.pow(point.y, 2)
                // );

                // Si la distancia es menor o igual al radio del punto, el ratón está sobre él
                if (distance <= config.pointRadius) {
                    // Formatear x e y para el log de la consola usando la nueva función
                    // const formattedX = formatCoordinate(point.x);
                    // const formattedY = formatCoordinate(point.y);
                    // console.log(`Mouse sobre punto: (${formattedX}, ${formattedY}), Distancia al origen: ${point.d}`);
                    pointDetected = true;
                    break; // Salir del bucle, solo loguear el primer punto detectado
                }
            }
            if (pointDetected && event.buttons == 1) {
                //Dibujar bandera en el punto 
                drawFlag(mouseProblemPos.x, mouseProblemPos.y)
            }

            if (pointDetected && event.buttons == 2) {
                //Borrar bandera en el punto 
                console.log("Borrar bandera");
                
            }
            // Opcional: loguear la posición del ratón si no está sobre ningún punto
            // if (!pointDetected) {
            //     console.log(`Mouse sobre canvas en (${mouseProblemPos.x.toFixed(2)}, ${mouseProblemPos.y.toFixed(2)})`);
            // }
        }

        // --- Inicialización y Limpieza ---

        function handleMouseMove_copy(event) {
            let pointDetected = false;
            const mouseProblemPos = getMousePos(canvas, event); // Posición del ratón en coordenadas del problema
            // Iterar sobre todos los puntos del fractal
            for (const point of listadoInfo) {
                const { x: cx, y: cy } = problemToCanvas(point.x, point.y); // Convertir punto a coordenadas del canvas
                const distance = calcularDistancia(mouseProblemPos, point)
                // Si la distancia es menor o igual al radio del punto, el ratón está sobre él
                if (distance <= config.pointRadius) {
                    let i = listadoInfo.indexOf(point);
                        if (!event.ctrlKey) {
                        //Dibujar bandera en el punto  
                        listadoInfo[i].flag = true;           
                    } else {
                        //Borrar bandera en el punto 
                        listadoInfo[i].flag = false;           
                    }
                    break; // Salir del bucle, solo loguear el primer punto detectado
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const vertex of listadoInfo) { // Iterar sobre listadoInfo que ya tiene 'd'

                drawPointFlag(vertex);
                drawPointText(vertex);
                if (vertex.flag) {
                    drawFlag(vertex.x, vertex.y);
                }
            }
            showSum();

        }

        /**
         * Inicializa el canvas: genera el fractal, dibuja los puntos y su información.
         * Esta función también se usa para la función de "limpiar".
        //  */
        function initCanvas() {
            // Limpiar todo     )();el contenido anterior del canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Reiniciar las listas de información y vértices
            listadoInfo = [];
            sierpinskiVertices = [];
            drawnFlags = []; // Limpiar cualquier bandera previamente dibujada

            // Define los vértices iniciales del triángulo equilátero
            // Base en (-1500, 0) y (1500, 0)
            const p1 = { x: -1500, y: 0 };
            const p2 = { x: 1500, y: 0 };
            // Calcula el tercer vértice (superior)
            const p3 = getEquilateralThirdVertex(p1, p2);

            // Genera todos los vértices del fractal de Sierpinski hasta la iteración máxima
            generateSierpinskiVertices(p1, p2, p3, 0, config.maxIterations, sierpinskiVertices);

            // Llena listadoInfo y dibuja cada punto con su texto
            // Se usa un for-of para asegurar que se procesen todos los vértices generados.
            for (const vertex of listadoInfo) { // Iterar sobre listadoInfo que ya tiene 'd'
                drawPointFlag(vertex);
                drawPointText(vertex);
            }
        }

        /**
         * Función para limpiar el canvas y restaurarlo a su estado inicial,
         * mostrando solo los vértices del fractal, sus coordenadas y distancias.
         */
        function clearCanvas() {
            initCanvas(); // Llama a initCanvas para reiniciar y redibujar el estado base
            showSum();
        }
        function showSum() {
            let promedio = obtenerPromedio();
            if (promedio === null) {
                document.getElementById("promcont").style.opacity = "0";
            }else{
                document.getElementById("prom").innerText = promedio;
                document.getElementById("promcont").style.opacity = "1";
            }
        }
        function obtenerPromedio() {
            let sumaDistancias = 0;
            let contadorElementosConFlagTrue = 0;
          
            for (let i = 0; i < listadoInfo.length; i++) {
              const elemento = listadoInfo[i];
          
              // Verificar si la propiedad 'flag' existe y es true
              if (elemento.hasOwnProperty('flag') && elemento.flag === true) {
                sumaDistancias += elemento.d;
                contadorElementosConFlagTrue++;
              }
            }
          
            // Calcular el promedio
            if (contadorElementosConFlagTrue > 0) {
              return sumaDistancias / contadorElementosConFlagTrue;
            } else {
              // Si no hay elementos con flag: true, se puede retornar 0 o manejar el error
              return null; 
            }
        }

        // --- Event Listeners ---
        // Escucha el movimiento del ratón sobre el canvas para detectar puntos
        // canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleMouseMove_copy);
        // Escucha el clic en el botón de limpiar
        clearButton.addEventListener('click', clearCanvas);
        // Escucha el clic en el botón para dibujar una bandera aleatoria
        // drawFlagButton.addEventListener('click', () => {
        //     // Dibuja una bandera en un punto aleatorio de los vértices del fractal
        //     if (listadoInfo.length > 0) {
        //         const randomIndex = Math.floor(Math.random() * listadoInfo.length);
        //         const randomPoint = listadoInfo[randomIndex];
        //         drawFlag(randomPoint.x, randomPoint.y);
        //     }
        // });

        // Inicializar el canvas cuando la página se haya cargado completamente
        // window.onload = initCanvas;
        initCanvas();
                /**
         * Toma los valores de un array de elementos HTML especificados por su ID
         * y los guarda en un archivo .txt para descargar.
         *
         * @param {string[]} elementIds - Un array de strings, donde cada string es el ID de un elemento HTML
         * que contiene un valor (ej. <input>, <textarea>, <select>).
         * @param {string} [filename='datos.txt'] - El nombre del archivo .txt a descargar.
         * Por defecto es 'datos.txt'.
         */
        function exportValuesToTxt(elementIds, filename = 'datos.txt') {
            let content = ''; // Variable para almacenar todo el contenido del archivo

            elementIds.forEach(id => {
                const element = document.getElementById(id);

                if (element) {
                    // Asegúrate de que el elemento tiene una propiedad 'value'
                    if (typeof element.value !== 'undefined') {
                        content += `${id}: ${element.value}\n`; // Añade el ID y su valor, seguido de un salto de línea
                    } else {
                        console.warn(`Elemento con ID '${id}' encontrado, pero no tiene propiedad 'value'.`);
                        content += `${id}: [No tiene valor]\n`;
                    }
                } else {
                    console.warn(`Elemento con ID '${id}' no encontrado en el DOM.`);
                    content += `${id}: [Elemento no encontrado]\n`;
                }
            });

            // Crea un Blob (Binary Large Object) con el contenido del texto
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

            // Crea un enlace temporal para la descarga
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); // Establece la URL del Blob
            a.download = filename;              // Establece el nombre del archivo de descarga
            document.body.appendChild(a);       // Añade el enlace al DOM (necesario para Firefox)
            a.click();                          // Simula un clic en el enlace para iniciar la descarga
            document.body.removeChild(a);       // Elimina el enlace del DOM
            URL.revokeObjectURL(a.href);        // Libera la URL del Blob para liberar memoria
        }