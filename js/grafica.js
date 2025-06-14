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
  
  generarHistograma(
    [144, 145, 148, 149, 149, 149, 149, 149, 152, 152, 153, 154, 155, 156, 157,157, 158, 163, 165],
    'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo de baja precisión', 'miHistograma'
  );
  generarHistograma(
    [144.9, 145.0, 145.7, 146.3, 147.0, 147.8, 148.5, 148.9, 149.0, 149.2, 150.0, 150.5, 151.0, 152.0, 153.0, 155.0, 158.0, 160.0, 169.7],
   'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo más avanzado', 'miHistograma2'
  );
  generarHistograma(
    [145.8, 147.6, 147.9, 148.2, 148.6, 148.9, 149.1, 150.0, 150.5, 150.8, 151.0, 151.2, 151.3, 151.5, 151.6],
   'Distancia (millones de km)', 'Frecuencia', 'Mediciones usando equipo de alta precisión', 'miHistograma3'
  );
