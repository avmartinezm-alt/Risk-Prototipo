# Guía de verificación manual

## Requisitos

- Chrome y Firefox actuales; un dispositivo móvil con navegador para validar
  GitHub Pages.
- Conectividad a Internet para descargar Chart.js desde jsDelivr.
- Node.js únicamente si se va a regenerar `datos.js` desde `riesgos.csv`.
- El informe aprobado y sus valores fuente para contrastar números, responsables,
  fechas, controles, mediciones y referencias.

## Abrir localmente

1. Abrir `index.html` con doble clic. No iniciar servidor ni proceso de build.
2. Confirmar que DIAGNÓSTICO esté activo, el encabezado muestre la ventana y el
   panel Resumen compare inherente y residual.
3. Recorrer las pestañas de P1 a P7. Confirmar fuentes en pies, etiquetas de
   niveles, texto en español, estados ausentes y medidas faltantes.
4. Abrir la consola del navegador y confirmar que no haya errores de ejecución con
   datos válidos.

## Regenerar datos

Desde la raíz del proyecto, ejecutar el generador con Node.js:

```powershell
node .\scripts\csv-a-js.js
```

Confirmar que el comando informa errores si hay filas inválidas y que, si termina
correctamente, `datos.js` define el objeto completo `window.DATOS_SGSI`. Volver a
abrir la página y comprobar que el cambio de CSV se refleja sin tocar HTML.
Sin Node.js, editar `datos.js` manualmente siguiendo el [contrato CSV→datos](contracts/csv-to-datos.md).

## Casos funcionales

1. Cambiar DIAGNÓSTICO/POST-IMPLEMENTACIÓN: P1 conserva ambas series, P2 cambia
   nivel, P3 cambia mapa y punto de partida del simulador, y P4/P5 no cambian.
2. Confirmar que el producto P×I y los límites 5, 6, 12, 13, 16, 17 y 25 se
   clasifican conforme a la escala oficial.
3. Mover cada deslizador y activar los cuatro escenarios; verificar etiqueta de
   simulación, valores resultantes y restablecimiento sin modificar datos.
4. Revisar mapa, matriz de controles, objetivos, gobernanza, filtros y fuentes de
   cada panel.
5. Con `fechaRatificacion` nula, comprobar barras por duración sin fechas ni
   «Hoy». Con fecha ISO cargada, comprobar fechas calculadas desde ratificación y
   marca «Hoy» desde fecha de corte.

## Casos de datos inválidos

1. En una copia de prueba de `datos.js`, cambiar P a 6; confirmar aviso rojo y que
   la página no quede en blanco.
2. En una copia de prueba, dejar solo cinco riesgos; confirmar el error de cantidad
   o IDs y que no se muestren como conjunto válido.
3. Dejar un control condicionado que no esté en el Anexo A; confirmar el aviso de
   validación.
4. Renombrar temporalmente `datos.js`; confirmar el mensaje exacto «No se
   encontraron los datos del informe». Restaurar el archivo después de cada caso.

## Publicación y presentación

1. Publicar los archivos estáticos en GitHub Pages con las rutas relativas
   acordadas.
2. Abrir la URL publicada en Chrome, Firefox y el navegador de un celular usando
   datos móviles; repetir la comprobación de contenido y consola disponible.
3. Verificar ancho de 1366 px, proyector, ancho menor a 1024 px, apertura de barra
   lateral, modo presentación con flechas/clic/Esc y vista de impresión.
4. Comprobar que no hay botones de exportación, llamadas de red para datos,
   persistencia en cookies o `localStorage`, ni edición de datos oficiales.

No publicar datos personales o confidenciales: GitHub Pages es un sitio público.
