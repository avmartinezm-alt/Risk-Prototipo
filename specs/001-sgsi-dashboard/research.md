# Investigación: Dashboard SGSI estático

**Fecha**: 2026-11-24  
**Alcance**: decisiones para el stack ya elegido; no se reconsidera el uso de backend, framework ni build.

## Decisiones

### HTML, CSS y JavaScript

- **Decisión**: usar HTML semántico, variables CSS y JavaScript vanilla ES2020 en
  scripts clásicos. Cargar `datos.js` antes de `app.js`; cargar Chart.js antes de
  ambos.
- **Razón**: conserva la apertura mediante doble clic y evita depender de un
  servidor de desarrollo. Las rutas de recursos deben ser relativas para que
  funcionen desde la raíz local y desde un subdirectorio de GitHub Pages.
- **Alternativas consideradas**: módulos ES en navegador. No se eligen porque el
  acceso de módulos y recursos locales bajo `file://` puede estar sujeto a
  restricciones CORS del navegador.

### Chart.js

- **Decisión**: fijar Chart.js **4.6.2** mediante su distribución UMD en
  jsDelivr. Usarlo solamente en los gráficos de barras de P1 y P3; conservar anillos,
  mapa, matriz y cronograma en SVG/CSS según la especificación.
- **Razón**: Chart.js documenta integración mediante etiqueta de script y un
  objeto global, compatible con HTML estático. Fijar versión evita que una URL
  `latest` cambie sin revisión.
- **Accesibilidad y ciclo de vida**: cada `canvas` debe tener nombre accesible y
  contenido equivalente —resumen o tabla textual— que comunique los valores sin
  depender del color. Actualizar una instancia existente con su API de
  actualización; destruirla antes de volver a asociar otra instancia al mismo
  `canvas`.
- **Alternativas consideradas**: instalar Chart.js y empaquetarlo. Se descarta
  porque añade dependencias/build y contradice el stack aprobado.

### Apertura local y publicación

- **Decisión**: no usar `fetch()` para `riesgos.csv` ni para datos locales durante
  el runtime. El navegador recibe los datos desde `datos.js`, cargado como script
  clásico. Publicar los mismos archivos estáticos en GitHub Pages.
- **Razón**: algunos navegadores tratan los orígenes `file://` como opacos y
  restringen solicitudes locales. GitHub Pages sirve archivos HTML, CSS y JS
  estáticos sin requerir backend.
- **Límite conocido**: Chart.js se descarga de jsDelivr, por lo que la primera
  apertura requiere conectividad para mostrar esos gráficos. Esto no es una
  llamada de red para datos del informe; GitHub Pages desde móvil con datos
  móviles cubre el escenario indicado.
- **Riesgo de publicación**: GitHub Pages es público. Solo se deben publicar los
  datos académicos autorizados; no incluir datos personales o información
  confidencial.

### CSV a JavaScript

- **Decisión**: el CSV contiene todos los conjuntos de datos como filas tipadas;
  el script Node genera el objeto completo `window.DATOS_SGSI`. Node solo se
  requiere para regenerar `datos.js`; no para abrir el dashboard.
- **Razón**: mantener una única fuente editable y una generación reproducible.
  Los campos y relaciones se documentan en el contrato de datos.
- **Robustez**: el lector debe respetar comillas, comas entrecomilladas y saltos
  de línea según la convención CSV elegida; dividir texto solo por comas no es
  suficiente. Validar filas y detener con error explícito ante tipo desconocido,
  duplicado o dato requerido inválido.
- **Alternativas consideradas**: editar solo el CSV de riesgos y conservar los
  demás datos manualmente en el JS. Se descarta tras la decisión del usuario de
  que el CSV contenga todos los conjuntos y el generador produzca `datos.js`
  completo.

## Fuentes

- [Chart.js: integración](https://www.chartjs.org/docs/latest/getting-started/integration.html)
- [Chart.js: instalación y CDN](https://www.chartjs.org/docs/latest/getting-started/installation.html)
- [Chart.js: accesibilidad](https://www.chartjs.org/docs/latest/general/accessibility.html)
- [Chart.js: API de gráficos](https://www.chartjs.org/docs/latest/developers/api.html)
- [MDN: elementos HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [MDN: variables CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)
- [MDN: módulos JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN: errores CORS y URL `file://`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp)
- [jsDelivr: paquete Chart.js](https://www.jsdelivr.com/package/npm/chart.js)
- [GitHub Pages: descripción](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages: origen de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Node.js: API de archivos](https://nodejs.org/api/fs.html)
- [RFC 4180: formato común CSV](https://www.rfc-editor.org/rfc/rfc4180)
- [WCAG 2.2: contenido no textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [WCAG 2.2: uso del color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
