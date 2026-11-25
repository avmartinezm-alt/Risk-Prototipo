# Modelo de datos: Dashboard SGSI

## Fuente y ciclo de vida

- `riesgos.csv` es la fuente editable completa, con una fila tipada por entidad.
- `scripts/csv-a-js.js` valida y transforma todas las filas en
  `window.DATOS_SGSI`, emitido en `datos.js`.
- La interfaz solo lee `datos.js`; no carga el CSV ni persiste cambios.
- Si no se ejecuta Node.js, `datos.js` puede editarse manualmente. El README
  documenta ambos flujos y cómo regenerar el objeto completo.
- El nivel de riesgo no es un campo de almacenamiento: se deriva como P×I con
  los límites oficiales de la constitución.

## Entidades

| Entidad | Campos principales | Relaciones y reglas |
|---|---|---|
| Metadatos | `fechaCorte`, `fechaRatificacion` | Valores transcritos desde el informe; `fechaRatificacion` puede ser `null`. Si la ratificación es nula, no hay fechas de calendario ni marca «Hoy» en el cronograma. Si falta `fechaCorte`, se muestra «Pendiente» y no se calcula «Hoy». |
| Riesgo | `id`, `causa`, `evento`, `consecuencia`, `activo`, `pInh`, `iInh`, `pRes`, `iRes` | Exactamente R-1 a R-6. Los cuatro valores P/I son enteros de 1 a 5. El nivel se calcula y no se guarda. |
| Acción de tratamiento | `id`, `riesgoId`, `plazoDias`, `responsable`, `estado`, `kri`, `evidencia` | Seis acciones asociadas a riesgos. Estado/responsable/KRI/evidencia ausentes no se inventan; se representa el fallback autorizado. Inicio y fin se calculan desde la ratificación cuando exista. |
| Control | `numero`, `categoria`, `incluido`, `justificacion`, `estado`, `metrica`, `evidencia`, `condicion` | Categorías organizacional, personas, físico y tecnológico. Un control puede marcarse como condicionado; su número debe existir en el conjunto del Anexo A. |
| Relación control-riesgo | `riesgoId`, `numeroControl`, `justificacion` | Relaciona un riesgo con un control existente; permite construir la matriz sin listas serializadas dentro de una celda CSV. |
| Objetivo | `id`, `nombre`, `meta`, `unidad`, `medicion`, `seccionFuente` | Cinco objetivos. La medición puede faltar; el estado del semáforo se deriva de la meta y medición. |
| Hito de gobernanza | `id`, `nombre`, `estado`, `fecha`, `seccionFuente` | Cinco hitos. Un estado ausente se presenta como «Pendiente». La fecha de ratificación se representa aparte en metadatos. |
| Escenario de simulación | `id`, `nombre`, `riesgoId`, `variable`, `valorInicial`, `valorSimulado`, `etiqueta` | Cuatro configuraciones suministradas por el informe/spec. Solo se aplican a una copia temporal en memoria. |
| Fuente | `entidadTipo`, `entidadId`, `campo`, `seccion` | Una referencia por cifra/dato trazable; no se inventan referencias de sección. |
| Fuente de panel | `panelId`, `seccion` | Cada panel obtiene de aquí las referencias que muestra en su pie. |

## Clasificación y valores derivados

- `P`, `I` y el producto son numéricos; nivel oficial es función del producto:
  1–5 Bajo, 6–12 Medio, 13–16 Alto, 17–25 Crítico.
- La ventana de riesgo determina qué pareja P/I alimenta tabla, mapa y punto de
  partida del simulador. La ventana inicial de interfaz es DIAGNÓSTICO.
- El gráfico P1 siempre compara valores inherentes y residuales, con etiquetas.
- El simulador mantiene un estado transitorio en memoria. No modifica el objeto
  fuente ni escribe cookies o almacenamiento local.
- Los totales de cobertura y objetivos en meta se derivan de las filas y estados
  disponibles; no se almacenan como números duplicados de presentación.
- Ausencia de medición: `null`/celda vacía para la medición y presentación «Sin
  medición». Ausencia de un estado de implementación/hito: fallback visual
  «Pendiente», sin crear un estado oficial.

## Reglas de integridad

1. Rechazar tipos de fila desconocidos, IDs duplicados, campos requeridos ausentes
   y referencias huérfanas.
2. Exigir seis riesgos R-1 a R-6 y P/I enteros de 1 a 5.
3. Exigir que toda relación y control condicionado haga referencia a un control
   del Anexo A.
4. Parsear fechas en formato ISO; permitir `fechaRatificacion` nula.
5. No almacenar categorías de riesgo, niveles, colores ni etiquetas de semáforo
   como fuente oficial: se derivan al representar.
6. Emitir error explícito al generar datos inválidos; en runtime presentar la
   alerta roja acordada. Si `datos.js` no carga, mostrar exactamente «No se
   encontraron los datos del informe».

Los valores reales de riesgos, controles, responsables, mediciones, estados,
evidencias y secciones deben transcribirse desde el informe; este modelo no los
completa.

Mientras no esté disponible el informe fuente, el CSV conserva solo el
encabezado y `datos.js` se mantiene en estado sin datos. El generador rechaza la
entrada incompleta y la aplicación muestra el aviso de datos faltantes; no se
usan filas de demostración en la entrega.
