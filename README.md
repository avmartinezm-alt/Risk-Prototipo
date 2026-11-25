# Dashboard SGSI — proyecto académico

Dashboard estático para resumir riesgos, tratamiento, controles, objetivos y
pendientes del SGSI del proceso de registro de asegurados y empleadores.
Es un proyecto académico, no un sistema oficial de EsSalud.

## Abrir

Abre `index.html` con doble clic. También puede publicarse como sitio estático en
GitHub Pages. No requiere servidor local, instalación de dependencias ni proceso
de compilación.

Chart.js se obtiene desde jsDelivr para dibujar los gráficos. La primera carga de
los gráficos requiere conexión a Internet; el resto de la página informa si la
biblioteca no está disponible.

## Datos y estado de esta entrega

`riesgos.csv` es la fuente editable y usa filas tipadas por la columna `tipo`.
El contrato de columnas y tipos está descrito en
[`specs/001-sgsi-dashboard/contracts/csv-to-datos.md`](specs/001-sgsi-dashboard/contracts/csv-to-datos.md).
El informe con los valores oficiales no estaba disponible al preparar esta
entrega. Por ello, `riesgos.csv` solo contiene su encabezado y `datos.js` señala
que no hay datos cargados; el dashboard muestra un aviso y no presenta métricas
inventadas. Esta entrega no está lista para aceptar cifras contra el informe.

No agregues cifras, responsables, mediciones, estados, fuentes ni fechas
supuestos. Completa el CSV transcribiendo el informe y deja los campos opcionales
vacíos cuando el dato no conste.

## Regenerar `datos.js`

Con Node.js instalado, desde la raíz del proyecto ejecuta:

```powershell
node .\scripts\csv-a-js.js
```

El generador valida filas, tipos, referencias y los seis riesgos antes de escribir
`datos.js`. Si los datos no son válidos, explica el error y conserva el archivo
anterior. `datos.js` también puede editarse manualmente siguiendo el contrato
CSV→datos.

Al publicar en GitHub Pages, recuerda que el contenido es público. No publiques
información personal ni confidencial.

## Funcionalidad

El dashboard distingue DIAGNÓSTICO y POST-IMPLEMENTACIÓN; el simulador trabaja
solo en memoria y no altera los datos oficiales. El modo presentación permite
navegar con las flechas y salir con Esc. La hoja de estilos incluye adaptación
móvil y reglas de impresión.

Los valores reales, citas y referencias deben incorporarse desde el informe antes
de considerar cumplidos los criterios numéricos de la especificación.
