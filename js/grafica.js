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
  
generarHistograma([102, 148, 149, 149, 149, 149, 149, 149, 149, 149, 150, 150, 151, 152, 153, 154, 155, 156, 157],
'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo de baja precisión', 'miHistograma');
generarHistograma([145.2, 146.5, 147.1, 148.0, 148.8, 149.1, 149.3, 149.5, 149.7, 149.9, 150.1, 150.3, 151.0, 152.4, 153.8, 154.5, 200.0, 250.0, 300.0],
'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo más avanzado', 'miHistograma2');
generarHistograma([147.9, 148.1, 148.3, 148.5, 148.6, 148.7, 148.8, 149.0, 149.2, 149.4, 149.8, 150.1, 150.5, 151.0, 151.1],
'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo de alta precisión', 'miHistograma3');
        
  