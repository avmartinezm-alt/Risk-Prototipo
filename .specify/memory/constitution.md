<!--
Sync Impact Report
Version change: plantilla sin versión → 1.0.0 (primera constitución).
Principios modificados: ninguno; se adoptan 17 principios nuevos.
Secciones añadidas: Condiciones obligatorias de aceptación; Flujo de cambios y revisión.
Secciones eliminadas: ninguna.
Pendiente: RATIFICATION_DATE hasta la aprobación de la alta dirección.
-->

# Dashboard SGSI EsSalud Constitution

## Core Principles

### I. Entrega estática
El entregable MUST consistir en `index.html`, `styles.css`, `app.js`, `datos.js`,
`riesgos.csv`, `scripts/csv-a-js.js` y `README.md`. MUST funcionar sin backend, base
de datos, paso de compilación ni framework, incluidos React, Vue, Angular y Tailwind.

### II. Apertura local y publicación equivalentes
El dashboard MUST funcionar al abrir `index.html` con doble clic y al publicarse en
GitHub Pages, sin modificaciones entre ambos entornos.

### III. Separación de datos y presentación
Las cifras, textos de riesgos, plazos, responsables, estados de implementación y
fechas MUST residir en el objeto `window.DATOS_SGSI` de `datos.js`. La interfaz MUST
presentar esos datos sin duplicarlos como contenido escrito a mano.

### IV. CSV como fuente editable
`riesgos.csv` MUST ser la fuente editable de riesgos y `scripts/csv-a-js.js` MUST
generar `datos.js`. Cuando no se use Node.js, `datos.js` MAY editarse manualmente.

### V. Nivel de riesgo calculado
Los niveles Bajo, Medio, Alto y Crítico MUST calcularse a partir de P×I en tiempo de
ejecución. MUST NOT almacenarse como texto en los datos.

### VI. Escala oficial y límites
La clasificación oficial MUST ser: 1–5 Bajo, 6–12 Medio, 13–16 Alto y 17–25
Crítico. Un resultado de 5 MUST clasificarse como Bajo.

### VII. Ventanas claramente separadas
El dashboard MUST distinguir DIAGNÓSTICO (`pInh`, `iInh`) de
POST-IMPLEMENTACIÓN (`pRes`, `iRes`). Toda cifra mostrada MUST identificar
visiblemente a qué ventana pertenece; MUST NOT mezclar datos de ambas sin etiqueta.

### VIII. Impacto oficial inalterable
El impacto oficial MUST conservarse en todas las vistas. Solo el simulador MAY
reducirlo, y MUST identificar ese resultado como escenario no oficial.

### IX. Trazabilidad por panel
Cada panel MUST incluir en su pie la sección del informe de la que provienen sus
datos, por ejemplo, «Fuente: sección 5.2.3».

### X. Validación visible de datos
Al cargar los datos, P e I MUST validarse como enteros entre 1 y 5; MUST existir
exactamente seis riesgos, R-1 a R-6; y cada control condicionado MUST existir en el
Anexo A. Si alguna validación falla, la interfaz MUST mostrar un aviso visible en
rojo y MUST NOT quedar en blanco.

### XI. Error de carga explícito
Si `datos.js` no carga, el dashboard MUST mostrar exactamente: «No se encontraron
los datos del informe».

### XII. Prohibición de datos inventados
El dashboard MUST NOT inventar estados de implementación, mediciones ni fechas que
no estén en `datos.js`. Cuando falte un dato, MUST mostrar «Sin medición» o
«Pendiente», según corresponda.

### XIII. Español del Perú
Todo texto visible para el usuario MUST estar en español del Perú. MUST NOT mostrarse
texto en inglés en la interfaz.

### XIV. Accesibilidad
La interfaz MUST cumplir contraste WCAG AA y usar texto de al menos 14 px. Los
colores que representen niveles MUST estar acompañados por su etiqueta textual.

### XV. Presentación e impresión
El dashboard MUST ser legible en una pantalla de 1366 px, en proyector y al
imprimirse. `styles.css` MUST definir estilos `@media print`. La interfaz MUST NOT
incluir botones de exportación.

### XVI. Sin persistencia
El dashboard MUST NOT usar `localStorage` ni cookies. El simulador MUST NOT modificar
`datos.js` ni persistir sus cambios.

### XVII. Consulta ante ambigüedad
Si una decisión necesaria no está definida por la especificación, el trabajo MUST
detenerse y solicitar aclaración antes de asumir un comportamiento.

## Condiciones obligatorias de aceptación

Una entrega MUST preservar los 17 principios anteriores. Las pruebas de aceptación
MUST cubrir la apertura local y publicada, la carga y validación de datos, los
cálculos de riesgo en los límites de la escala, la separación de ventanas, el
contenido visible en español, la impresión y la ausencia de persistencia.

## Flujo de cambios y revisión

Antes de implementar un cambio, quienes lo desarrollen MUST verificar su conformidad
con esta constitución. Toda excepción o cambio de un principio MUST proponerse como
enmienda antes de aplicarse; una enmienda MUST documentar su justificación,
actualizar la versión semántica y conservar la trazabilidad de los cambios.
Los cambios MUST revisarse contra los criterios de aceptación aplicables. Cuando
falte una decisión de producto, MUST solicitarse aclaración en vez de completar el
vacío por inferencia.

## Governance

Esta constitución rige el diseño, la implementación y la revisión del Dashboard
SGSI EsSalud. Las enmiendas MUST explicitar el cambio, su justificación y su impacto
en los principios existentes. La versión MUST seguir semver: MAJOR para cambios
incompatibles o redefiniciones, MINOR para principios o requisitos nuevos o
ampliados, y PATCH para aclaraciones sin cambio semántico. Toda revisión de cambios
MUST comprobar su conformidad con esta constitución.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): pendiente de aprobación de la alta dirección | **Last Amended**: 2026-11-24
