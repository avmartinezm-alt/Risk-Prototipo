# Contrato CSV → datos.js

## Propósito

Definir la entrada del generador opcional `scripts/csv-a-js.js` y la salida
consumida por el dashboard. No se expone API HTTP ni se carga `riesgos.csv` en el
navegador.

## Archivo de entrada

- Codificación UTF-8 y encabezado único.
- Delimitador coma; comillas dobles para campos con comas, comillas o saltos de
  línea. Una comilla dentro de un campo entrecomillado se representa como `""`.
- Cada fila representa una entidad y lleva `tipo` e `id` no vacíos; las columnas
  no aplicables a ese tipo se dejan vacías.
- El generador procesa filas tipadas y relaciones explícitas; no interpreta
  celdas con listas separadas por comas ni evalúa texto como JavaScript.

## Tipos de fila y campos

| `tipo` | Campos específicos requeridos |
|---|---|
| `metadato` | `id` (por ejemplo, `fechaCorte` o `fechaRatificacion`), `valor` |
| `riesgo` | `id`, `causa`, `evento`, `consecuencia`, `activo`, `pInh`, `iInh`, `pRes`, `iRes` |
| `accion` | `id`, `riesgoId`, `plazoDias`; `responsable`, `estado`, `kri` y `evidencia` cuando existan |
| `control` | `id` igual al número de control, `categoria`, `incluido`; `condicion`, `justificacion`, `estado`, `metrica` y `evidencia` cuando existan |
| `relacion_control_riesgo` | `id`, `riesgoId`, `numeroControl`, `justificacion` |
| `objetivo` | `id`, `nombre`, `meta`, `unidad`; `medicion` puede estar vacía |
| `hito_gobernanza` | `id`, `nombre`; `estado` y `fecha` pueden estar vacíos |
| `escenario_simulacion` | `id`, `nombre`, `riesgoId`, `variable`, `valorInicial`, `valorSimulado`; `etiqueta` para identificar la reducción como no oficial |
| `fuente` | `id`, `entidadTipo`, `entidadId`, `campo`, `seccion` |
| `fuente_panel` | `id`, `panelId`, `seccion` |

El encabezado contiene la unión de estos campos, en el orden establecido en
`riesgos.csv`. El parser convierte campos numéricos a valores numéricos, fechas
ISO a cadenas de fecha y `incluido` a booleano. Las celdas vacías opcionales se
omiten; una medición vacía queda ausente y `fechaRatificacion` vacía o con `null`
explícito se convierte a `null`. El metadato `fechaCorte` es obligatorio.
No se convierten textos faltantes en estados oficiales; la interfaz aplica
únicamente los fallbacks «Pendiente» y «Sin medición».

La generación completa valida seis riesgos R-1 a R-6 con P/I enteros de 1 a 5,
seis acciones, 93 controles distribuidos en 37 organizacionales, 8 de personas,
14 físicos y 34 tecnológicos, tres controles condicionados, cinco objetivos,
cinco hitos de gobernanza y cuatro escenarios. Las relaciones deben referenciar
riesgos y controles existentes.

## Salida

El generador produce un `datos.js` autocontenido que asigna un único objeto global
`window.DATOS_SGSI`. Incluye `metadatos` como objeto y colecciones tipadas
`riesgos`, `acciones`, `controles`, `relaciones`, `objetivos`, `hitos`,
`escenarios`, `fuentes` y `fuentesPanel`. Un control usa el campo `numero` en la
salida, derivado del `id` CSV. La salida no contiene niveles de riesgo
precalculados ni código ejecutable derivado de datos.

## Errores

- El generador termina con error no exitoso y mensaje que identifica fila/campo
  cuando hay tipo desconocido, ID duplicado, dato requerido inválido o referencia
  huérfana; no presenta una salida parcial como exitosa.
- La aplicación valida nuevamente P/I, cantidad/IDs de riesgos y existencia de
  controles condicionados al cargar `datos.js`.
- Si no existe/carga `datos.js`, la aplicación presenta exactamente «No se
  encontraron los datos del informe».

## Orden de carga

1. Chart.js UMD, desde la versión fijada de jsDelivr.
2. `datos.js`, que define `window.DATOS_SGSI`.
3. `app.js`, que valida y renderiza los datos.

Los tres se cargan como scripts clásicos en orden de documento. El HTML, CSS,
JavaScript y datos locales usan rutas relativas; el runtime no obtiene datos con
`fetch()`.
