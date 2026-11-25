# Implementation Plan: Dashboard SGSI de Riesgos

**Branch**: `001-sgsi-dashboard` (referencia del plan; no creada, el workspace no tiene Git) | **Date**: 2026-11-24 | **Spec**: [spec.md](spec.md)

**Input**: Especificación del dashboard más las decisiones técnicas suministradas para HTML5, CSS3, JavaScript ES2020, Chart.js y publicación estática.

## Summary

Crear un dashboard académico de siete paneles navegables por pestañas, que compare
riesgos del diagnóstico y post-implementación, explique su tratamiento y muestre
controles, objetivos y pendientes. La aplicación será estática y abrirá desde
`index.html` o GitHub Pages. `riesgos.csv` contendrá filas tipadas para todos los
conjuntos de datos; el generador opcional de Node producirá el objeto completo
`window.DATOS_SGSI` en `datos.js`. La aplicación usará scripts clásicos ES2020,
Chart.js 4.6.2 desde jsDelivr para barras, SVG propio para anillos y CSS Grid para
mapa, matriz y cronograma. La ventana inicial será DIAGNÓSTICO.

## Technical Context

**Language/Version**: HTML5 semántico, CSS3 y JavaScript vanilla ES2020 en scripts clásicos; Node.js solo para generación opcional del archivo de datos.

**Primary Dependencies**: Chart.js 4.6.2 UMD desde `cdn.jsdelivr.net`; sin framework.

**Storage**: Sin base de datos ni persistencia del navegador. La fuente editable es `riesgos.csv`; la salida runtime es `datos.js`.

**Testing**: Verificación manual en Chrome y Firefox; validación de datos correctos e incorrectos; apertura local, GitHub Pages móvil con datos móviles, consola y vista de impresión. El generador se valida con CSV correcto, valores inválidos y campos requeridos ausentes.

**Target Platform**: Navegadores actuales de escritorio y móvil; apertura local mediante `file://`; publicación estática en GitHub Pages.

**Project Type**: Aplicación web estática de un solo documento, con un script de generación opcional.

**Performance Goals**: La audiencia identifica el resumen en menos de 60 segundos; los gráficos y simulaciones se actualizan sin recarga y responden a la interacción. Debe ser legible a 1366 px, en proyector, en impresión y en móvil.

**Constraints**: Sin backend, base de datos, build, framework, módulos ES cargados localmente, solicitudes de red para datos, cookies, `localStorage`, exportación ni edición de datos oficiales desde la interfaz. Chart.js se carga desde CDN y requiere conectividad para dibujar los gráficos cuando no está disponible en caché. Los scripts de datos y aplicación se cargan en ese orden.

**Scale/Scope**: Siete paneles; seis riesgos y acciones; 93 controles en cuatro categorías; cinco objetivos; cinco hitos de gobernanza; cuatro escenarios simulados.

## Constitution Check

**GATE antes de Phase 0: PASS**

- **Entrega, plataforma y alcance**: solo los siete archivos de producto indicados; página estática compatible con doble clic y GitHub Pages; sin backend, base de datos, build ni framework.
- **Datos y cálculo**: el runtime consume `window.DATOS_SGSI`; el CSV tipado genera el objeto completo; niveles se calculan con P×I y no se almacenan.
- **Ventanas e impacto**: diagnóstico inicial; la tabla, el mapa y el punto de partida del simulador siguen la ventana activa. El gráfico P1 siempre identifica y compara inherente y residual. La reducción del impacto solo existe como escenario simulado no oficial.
- **Trazabilidad y validación**: referencias de sección por panel; seis riesgos, P/I enteros de 1 a 5 y controles condicionados existentes; errores visibles y mensaje exacto si no carga `datos.js`.
- **Integridad del contenido**: sin estados, fechas o mediciones inventados; ausencia expresada como «Pendiente» o «Sin medición».
- **Experiencia y accesibilidad**: interfaz en español del Perú, contraste AA, texto mínimo 14 px, nivel con etiqueta, vista adaptable y de impresión, sin botones de exportación.
- **Privacidad y cambios no definidos**: sin cookies ni almacenamiento local; las decisiones abiertas se consultaron y quedaron resueltas antes de planificar.
- **CDN**: permitido expresamente; solo sirve la biblioteca Chart.js, no datos del informe. Se fija la versión y se documenta la dependencia de conectividad. Los datos publicados deben ser académicos y no incluir información personal o confidencial.

**Revisión después de Phase 1: PASS**. El modelo y el contrato mantienen el CSV como fuente completa, los niveles derivados, los datos ausentes explícitos y la ausencia de persistencia.

## Diseño de la aplicación

- **`index.html`**: documento semántico con barra superior, navegación por pestañas
  y siete paneles; carga Chart.js, luego `datos.js` y después `app.js` como scripts
  clásicos ordenados.
- **`styles.css`**: variables `:root` para la paleta acordada, estructura lateral
  y superior, vista adaptable, paneles, indicadores CSS/SVG y `@media print`.
- **`app.js`**:
  - `validarDatos()` valida el objeto al inicio y presenta el mensaje/alerta de
    fallo según el tipo de error.
  - `nivel(valor)` es pura: recibe el producto P×I y devuelve la etiqueta oficial.
  - `ventanaActiva()` conserva el selector transitorio, inicializado en
    DIAGNÓSTICO, y entrega los valores para tabla, mapa y simulador.
  - Un render independiente para cada panel P1–P7.
  - `simulador()` mantiene cambios en memoria, aplica escenarios y restaura la
    ventana activa.
  - `navegacion()` gestiona pestañas, menú, búsquedas, filtros y modo presentación.
- **Gráficos**: Chart.js para barras P1/P3; SVG propio para anillos; CSS Grid y
  barras CSS para mapa de calor, matriz control-riesgo y cronograma.
- **`scripts/csv-a-js.js`**: herramienta Node opcional que valida filas tipadas y
  escribe el objeto completo `window.DATOS_SGSI`. No participa en la apertura del
  dashboard.

## Project Structure

### Documentation (this feature)

```text
specs/001-sgsi-dashboard/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── csv-to-datos.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
index.html
styles.css
app.js
datos.js
riesgos.csv
README.md
scripts/
└── csv-a-js.js
```

**Structure Decision**: Aplicación web estática sin carpetas de frontend/backend.
Los archivos de ejecución están en la raíz y el único script de generación en
`scripts/`. El contrato CSV→datos documenta el límite entre la fuente editable y
los datos de runtime; no se necesita API ni contrato de red.

## Complexity Tracking

No hay violaciones de la constitución ni proyectos adicionales. Chart.js por CDN
es una dependencia aprobada explícitamente y no requiere empaquetador.
