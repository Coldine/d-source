function generarHistograma(datos, etiquetaEjeX = 'Valores', etiquetaEjeY = 'Frecuencia', titulo = 'Histograma', givenId) {
    const frecuencia = {};
    datos.forEach(valor => {
      frecuencia[valor] = (frecuencia[valor] || 0) + 1;
    });
    const etiquetas = Object.keys(frecuencia).sort((a, b) => parseFloat(a) - parseFloat(b));
    const valores = etiquetas.map(etiqueta => frecuencia[etiqueta]);
    const ctx = document.getElementById(givenId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: etiquetaEjeY,
          data: valores,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 5
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: etiquetaEjeY
            }
          },
          x: {
            title: {
              display: true,
              text: etiquetaEjeX
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: titulo,
            font: {
              size: 16
            }
          }
        }
      }
    });
  }
  
generarHistograma([130, 135, 140, 145, 147, 148, 148, 148, 148, 149, 149, 149, 149, 149, 149, 150, 152, 155, 160, 165, 170],
'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo de baja precisión', 'miHistograma');
generarHistograma([120, 145, 146, 147, 147, 148, 148, 148, 149, 149, 149, 150, 150, 150, 151, 152, 153, 154, 200, 250],
'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo más avanzado', 'miHistograma2');
generarHistograma([147.9, 148.1, 148.3, 148.5, 148.6, 148.4, 148.2, 148.7, 148.5, 148.3, 148.6, 148.2, 148.5, 148.1, 148.4],
'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo de alta precisión', 'miHistograma3');
        
  