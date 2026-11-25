# Feature Specification: Dashboard SGSI de Riesgos

**Feature Branch**: `No creada (workspace sin repositorio Git)`

**Created**: 2026-11-24

**Status**: Draft

**Input**: Dashboard académico de una sola página para explicar riesgos, tratamiento y pendientes del SGSI del proceso de registro de asegurados y empleadores de EsSalud, conforme a ISO/IEC 27001:2022.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprender el resumen de riesgos (Priority: P1)

Como observador de una presentación académica, quiero comparar el diagnóstico
anterior a la implementación con el estado posterior a los controles y entender
los principales resultados en menos de un minuto.

**Why this priority**: Es el propósito central del dashboard y debe comunicar el
resultado antes de que el observador consulte el detalle.

**Independent Test**: Con datos válidos para seis riesgos, presentar el resumen a
una persona que no conozca el informe y verificar que identifica ambas ventanas,
los riesgos mitigados y el plan general en menos de 60 segundos.

**Acceptance Scenarios**:

1. **Given** que los datos oficiales están cargados, **When** el observador abre el
   resumen, **Then** ve tres indicadores para riesgos mitigados, controles
   condicionados y objetivos en meta, además del gráfico de los seis riesgos.
2. **Given** que el observador cambia la ventana activa, **When** consulta Riesgos
   y el mapa, **Then** la tabla y el mapa reflejan la ventana elegida sin recargar,
   mientras el gráfico del Resumen sigue mostrando ambas series.
3. **Given** que el observador no conoce los niveles, **When** consulta el resumen,
   **Then** cada color de nivel está acompañado por su etiqueta textual y el panel
   muestra su referencia al informe.

---

### User Story 2 - Revisar riesgos y trazabilidad (Priority: P1)

Como responsable de revisar el análisis, quiero consultar la causa, el evento, la
consecuencia, el activo afectado y el nivel de cada riesgo, y abrir sus detalles y
fuentes.

**Why this priority**: Permite verificar que el resumen corresponde a los riesgos
del informe y entender el tratamiento asignado a cada uno.

**Independent Test**: Consultar los seis riesgos, cambiar la ventana, abrir una
fila y seguir la referencia de fuente hasta identificar sus valores, controles,
responsable y plazo.

**Acceptance Scenarios**:

1. **Given** seis riesgos cargados, **When** se abre el panel Riesgos, **Then** se
   muestran seis filas con ID, causa, evento, consecuencia, activo y nivel de la
   ventana activa.
2. **Given** una fila de riesgo, **When** el usuario la abre, **Then** ve P×I
   inherente y residual, controles del Anexo A, responsable, plazo y referencias de
   sección correspondientes.
3. **Given** texto de búsqueda, **When** se busca en el panel o en el buscador
   superior, **Then** se filtran los riesgos pertinentes sin cambiar los datos
   oficiales.

---

### User Story 3 - Explorar escenarios de riesgo (Priority: P2)

Como observador, quiero ver dónde se ubican los riesgos en la matriz y ensayar
escenarios didácticos sin confundirlos con resultados oficiales.

**Why this priority**: Hace comprensible el efecto potencial de los controles y
permite explorar resultados sin alterar el informe.

**Independent Test**: Seleccionar una ventana, mover los valores de un riesgo y
activar cada escenario predefinido; verificar los cálculos, etiquetas y restauración
de los valores oficiales.

**Acceptance Scenarios**:

1. **Given** una ventana activa, **When** se muestra el mapa de calor, **Then** cada
   riesgo aparece en la celda definida por su probabilidad e impacto de esa ventana.
2. **Given** una ventana POST-IMPLEMENTACIÓN, **When** se muestra el mapa, **Then**
   el valor inherente se representa como contorno y el residual como relleno.
3. **Given** que el usuario modifica probabilidad o impacto, **When** cambia un
   deslizador, **Then** el producto P×I, el nivel, el mapa y el gráfico se actualizan
   en tiempo real y se compara el resultado con el valor oficial.
4. **Given** que hay cambios simulados, **When** el usuario restablece los valores,
   **Then** el simulador vuelve a los valores oficiales de la ventana activa.
5. **Given** cualquier escenario simulado, **When** se presenta el resultado,
   **Then** permanece visible el aviso «SIMULACIÓN · no es el resultado oficial del
   informe» y ningún dato oficial queda modificado.

---

### User Story 4 - Entender el plan de tratamiento (Priority: P2)

Como observador, quiero comparar la duración de las acciones, revisar sus
responsables y evidencias y distinguir el estado que consta en los datos.

**Why this priority**: El propósito del dashboard incluye mostrar qué falta por
cerrar, sin atribuir avances no documentados.

**Independent Test**: Filtrar el cronograma por riesgo, consultar una acción y
verificar su duración, estado, responsable, indicador y evidencia; repetir con
fecha de ratificación nula y definida.

**Acceptance Scenarios**:

1. **Given** el plan con seis acciones, **When** se abre Cronograma, **Then** se
   muestran las duraciones en días indicadas para R-1 a R-6 y se puede filtrar por
   riesgo.
2. **Given** una acción con fecha de ratificación nula, **When** se muestra el
   cronograma, **Then** las barras expresan duración sin fechas de inicio o fin y
   no aparece la marca «Hoy».
3. **Given** una fecha de ratificación válida, **When** se muestra el cronograma,
   **Then** cada fecha se calcula desde esa fecha más su plazo y la marca «Hoy» usa
   la fecha de corte.
4. **Given** que falta el estado de una acción, **When** se muestra, **Then** aparece
   «Pendiente» y no se presume «Planificado» ni otro estado.

---

### User Story 5 - Consultar cobertura y relación de controles (Priority: P2)

Como revisor del Anexo A, quiero examinar la cobertura por categoría, los controles
condicionados y la relación de controles con riesgos.

**Why this priority**: Hace visible el alcance de la Declaración de Aplicabilidad y
la evidencia que sustenta el tratamiento.

**Independent Test**: Consultar las cuatro categorías, buscar un control por número,
abrir una celda de relación riesgo-control y consultar los controles condicionados.

**Acceptance Scenarios**:

1. **Given** los datos del Anexo A, **When** se abre Controles, **Then** se muestran
   37 controles organizacionales, 8 de personas, 14 físicos y 34 tecnológicos,
   con avance por categoría y «Sin medición» cuando falte el estado.
2. **Given** uno de los controles condicionados cargados, **When** se consulta,
   **Then** se muestra su condición y evidencia requerida; la lista corresponde a
   los datos y a controles existentes en el Anexo A.
3. **Given** una matriz riesgo-control, **When** se selecciona una celda marcada,
   **Then** se muestran el control, su número y la justificación asociada.
4. **Given** un número de control o texto, **When** se busca, **Then** se muestran
   categoría, justificación de inclusión, métrica y evidencia disponibles.

---

### User Story 6 - Verificar objetivos y gobernanza (Priority: P2)

Como integrante del equipo académico, quiero distinguir los objetivos medidos de
los pendientes y revisar los hitos de gobernanza que faltan.

**Why this priority**: Permite entender las brechas de medición y aprobación que
permanecen abiertas.

**Independent Test**: Revisar los cinco objetivos y los cinco hitos de gobernanza
con datos completos, parciales y sin medición.

**Acceptance Scenarios**:

1. **Given** los cinco objetivos definidos, **When** se abre Objetivos, **Then** se
   ve la meta de cada uno, su valor de datos o «Sin medición» y el semáforo.
2. **Given** un valor medido, **When** se compara con su meta, **Then** el estado es
   verde si cumple, amarillo si el déficit es menor de 10 puntos porcentuales y
   rojo si el déficit es de 10 puntos porcentuales o más.
3. **Given** un objetivo sin valor, **When** se muestra, **Then** su semáforo es
   gris y el texto indica «Sin medición».
4. **Given** fecha de ratificación nula, **When** se abre Gobernanza, **Then** la
   ratificación aparece como «Pendiente»; la píldora global indica «Borrador»
   mientras quede al menos un pendiente.

---

### User Story 7 - Presentar y navegar el dashboard (Priority: P3)

Como expositor, quiero navegar por los paneles y usar un modo de presentación
legible, accesible y apto para impresión.

**Why this priority**: Asegura que la información pueda consultarse en pantalla,
proyector y papel durante una exposición.

**Independent Test**: Usar el dashboard a 1366 px, por debajo de 1024 px, con
teclado, en modo presentación y en vista de impresión.

**Acceptance Scenarios**:

1. **Given** una pantalla de al menos 1024 px, **When** se abre el dashboard,
   **Then** se ven la barra lateral, la barra superior y el panel activo con los
   estilos especificados.
2. **Given** una pantalla menor de 1024 px, **When** se abre el dashboard,
   **Then** la barra lateral queda oculta y puede abrirse con un botón.
3. **Given** que se activa Modo presentación, **When** se navega con flechas o clic,
   **Then** se muestra un panel por pantalla; al pulsar Esc se sale del modo.
4. **Given** que se imprime el dashboard, **When** se abre la vista de impresión,
   **Then** el contenido permanece legible y no aparecen controles de navegación
   innecesarios.

## Edge Cases

- Si `datos.js` no carga, se muestra exactamente «No se encontraron los datos del
  informe» en un aviso visible; la interfaz no queda en blanco.
- Si P o I no es entero o está fuera de 1–5, si falta alguno de los seis riesgos o
  si un control condicionado no existe en el Anexo A, se muestra un aviso rojo
  identificable y no se presentan esos datos como válidos.
- Si falta una medición, estado, responsable, evidencia o fecha, se muestra el
  texto de ausencia definido para el dato («Sin medición» o «Pendiente») y no se
  completa por inferencia.
- Si `fechaRatificacion` es nula, el cronograma conserva sus duraciones y oculta
  fechas de calendario y la marca «Hoy».
- Si no hay riesgos coincidentes con una búsqueda o filtro, se informa que no hay
  resultados sin reemplazar los datos.
- Si un escenario predefinido se activa, se distingue del valor oficial y el
  restablecimiento devuelve los valores de la ventana activa.
- Si un objetivo no tiene medición, se muestra en gris independientemente de su
  meta.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El producto MUST presentarse como proyecto académico, no como sistema
  oficial de EsSalud, y MUST NOT mostrar logotipos o marcas de EsSalud o de la UCV.
- **FR-002**: El entregable MUST ser estático y abrirse mediante `index.html` tanto
  localmente como en GitHub Pages, sin backend, base de datos, paso de compilación
  ni framework.
- **FR-003**: Las cifras, textos de riesgo, plazos, responsables, estados y fechas
  oficiales MUST provenir de `window.DATOS_SGSI` en `datos.js`. La interfaz MUST
  reflejar los cambios en esos datos al volver a cargar, sin editar HTML.
- **FR-004**: `riesgos.csv` MUST ser la fuente editable de riesgos y
  acciones, controles, objetivos, gobernanza, escenarios, metadatos y fuentes.
  MUST usar filas tipadas por entidad. `scripts/csv-a-js.js` MUST generar el
  `datos.js` completo; el README MUST explicar el formato. La edición manual de
  `datos.js` también MUST ser posible cuando no se use Node.js.
- **FR-005**: El dashboard MUST validar P e I como enteros de 1 a 5, la existencia
  exacta de R-1 a R-6 y que cada control condicionado exista en el Anexo A.
- **FR-006**: Si falla la carga de `datos.js`, el dashboard MUST mostrar «No se
  encontraron los datos del informe». Si los datos no superan la validación, MUST
  mostrar un aviso visible en rojo y MUST NOT quedar en blanco.
- **FR-007**: Los niveles MUST calcularse desde P×I y clasificarse con la escala
  oficial: 1–5 Bajo, 6–12 Medio, 13–16 Alto y 17–25 Crítico. El nivel MUST NOT
  almacenarse como texto en los datos y el valor 5 MUST ser Bajo.
- **FR-008**: La interfaz MUST ofrecer las ventanas «DIAGNÓSTICO
  (pre-implementación)» y «POST-IMPLEMENTACIÓN», vinculadas respectivamente a
  `pInh`/`iInh` y `pRes`/`iRes`. Al abrir el dashboard, «DIAGNÓSTICO
  (pre-implementación)» MUST estar activa inicialmente.
- **FR-009**: La ventana activa MUST aparecer en el encabezado y actualizar los
  niveles de la tabla P2, el mapa P3 y el punto de partida del simulador, sin
  recargar. El gráfico P1 MUST mantener siempre juntas las series inherente y
  residual, sin cambiar al alternar ventanas. P4 y P5 MUST permanecer iguales al
  cambiar de ventana.
- **FR-010**: Cada dato de riesgo MUST identificar visiblemente su ventana; ningún
  panel MUST mezclar ventanas sin etiquetas. El impacto oficial MUST conservarse
  en todas las vistas; solo la simulación puede reducirlo y debe etiquetarse como
  escenario no oficial.
- **FR-011**: El panel Resumen MUST incluir anillos para riesgos que pasan de Alto
  o Crítico inherente a Bajo residual, controles condicionados identificados sobre
  un total de tres y objetivos en meta de un total de cinco. Sus valores MUST
  derivarse de los datos.
- **FR-012**: El Resumen MUST mostrar un gráfico de barras agrupadas para R-1 a R-6,
  mostrando siempre juntas las series inherente y residual, con probabilidad,
  impacto y nivel en la información emergente. Al
  seleccionar una barra, MUST destacarse el riesgo asociado en el panel Riesgos.
- **FR-013**: El Resumen MUST mostrar una píldora con los conteos de riesgos,
  controles y acciones obtenidos de los datos, que correspondan a seis, 93 y seis,
  respectivamente. Su pie MUST mostrar «Fuente: secciones 5.1.4 y 5.2.3 del
  informe».
- **FR-014**: Riesgos MUST mostrar seis filas con ID, causa, evento, consecuencia,
  activo afectado y nivel de la ventana activa. Al abrir una fila MUST mostrar los
  valores P×I inherente y residual, controles relacionados, responsable, plazo y
  fuentes del informe.
- **FR-015**: Cada cifra trazable del detalle de riesgo MUST enlazar o revelar su
  sección fuente. El pie del panel MUST mostrar «Fuente: secciones 5.1.3, 5.1.4 y
  5.2.3».
- **FR-016**: La búsqueda superior MUST admitir riesgos y controles por texto; los
  paneles de riesgos y controles MUST permitir sus búsquedas correspondientes.
- **FR-017**: El mapa MUST tener una matriz de 5×5 y ubicar los riesgos con P e I
  de la ventana activa. En POST-IMPLEMENTACIÓN, MUST distinguir el inherente con
  contorno y el residual con relleno; sus zonas MUST corresponder a la escala
  oficial de niveles.
- **FR-018**: El simulador MUST permitir modificar probabilidad e impacto de 1 a 5
  para un riesgo, recalcular P×I, nivel, mapa y gráfico en tiempo real y comparar
  el resultado con el valor oficial.
- **FR-019**: El simulador MUST mantener visible «SIMULACIÓN · no es el resultado
  oficial del informe», MUST ofrecer «Restablecer valores oficiales» y MUST NOT
  guardar cambios ni modificar los datos oficiales. La comparación MUST seguir el
  formato «Oficial: valor (nivel) → Simulado: valor (nivel)».
- **FR-020**: El simulador MUST ofrecer los escenarios «Sin MFA» (R-4: probabilidad
  2 a 3), «Sin WAF» (R-2: probabilidad 1 a 4), «Sin enlace secundario» (R-5:
  probabilidad 1 a 3) y «Reducción de impacto con respaldos» (R-1: impacto 4 a 2).
  El último MUST identificarse como escenario no oficial. El pie MUST mostrar
  «Simulación con fines didácticos. Valores oficiales en la sección 5.2.3.».
- **FR-021**: Cronograma MUST mostrar acciones para R-1 a R-6, con duraciones
  provenientes de los datos, correspondientes a 90, 120, 60, 60, 90 y 45 días,
  respectivamente, como barras comparables.
- **FR-022**: Si `fechaRatificacion` es nula, Cronograma MUST omitir fechas de inicio
  y fin, presentar las barras solo por duración y ocultar «Hoy». Si tiene valor,
  MUST calcular inicio y fin sumando cada plazo desde la fecha de ratificación y
  mostrar «Hoy» según `fechaCorte`.
- **FR-023**: Al pasar el cursor sobre una acción del cronograma, MUST mostrar
  responsable, indicador clave de riesgo (KRI) y evidencia esperada cuando existan.
  MUST
  permitir filtrar por riesgo y mostrar el pie «Plazos en días desde la aprobación
  del plan (pendiente de fecha oficial)». También MUST mostrar las secciones fuente
  que indiquen los datos, sin inventar referencias.
- **FR-024**: Los estados «Planificado», «En implementación» e «Implementado»
  MUST representarse, respectivamente, en gris, azul y verde cuando esos estados
  estén presentes en los datos. Si falta un estado, MUST mostrarse «Pendiente» y
  no inventarse un estado de implementación.
- **FR-025**: Controles MUST presentar tarjetas para los 93 controles y la
  cobertura por categoría, con conteos de datos que correspondan a 37
  organizacionales, 8 de personas,
  14 físicos y 34 tecnológicos, y avance basado en los estados de datos. Si falta
  un estado de medición, MUST mostrar «Sin medición».
- **FR-026**: Controles MUST presentar la lista condicionada de datos —incluidos
  5.23 nube, 7.9 equipos fuera de sede y 8.30 desarrollo subcontratado cuando
  correspondan— junto con condición y evidencia requerida.
- **FR-027**: La matriz control-riesgo MUST mostrar R-1 a R-6 frente a categorías
  del Anexo A; al abrir una celda marcada MUST mostrar control, número y
  justificación.
- **FR-028**: La búsqueda de controles MUST admitir números como «8.5» y mostrar
  categoría, justificación de inclusión, métrica y evidencia disponible. El pie
  MUST mostrar «Fuente: Anexo A, Declaración de Aplicabilidad (SOA-SGSI-01)».
- **FR-029**: Objetivos MUST mostrar un anillo de progreso para cada uno de los
  cinco objetivos y sus metas siguientes:
  MFA en cuentas administrativas (100 %), restauraciones exitosas (100 %),
  disponibilidad del registro en línea (al menos 97 %), vulnerabilidades críticas
  y altas remediadas en plazo (100 %) y proveedores críticos evaluados (100 %).
  Los objetivos y metas MUST leerse de los datos.
- **FR-030**: Cada objetivo MUST mostrar su valor de datos o «Sin medición». MUST
  usar semáforo gris si no hay medición, verde si cumple, amarillo si está a menos
  de 10 puntos porcentuales de la meta y rojo si el déficit es de 10 puntos
  porcentuales o más.
- **FR-031**: Gobernanza MUST incluir aprobación del SGSI por la alta dirección,
  firmas de seis propietarios de riesgo, presupuesto aprobado, programa anual de
  auditoría interna y primer informe, y primera revisión por la dirección. El
  estado MUST provenir de los datos; si no está indicado, MUST mostrarse
  «Pendiente».
- **FR-032**: Gobernanza MUST mostrar la fecha de ratificación como «Pendiente»
  cuando sea nula. La píldora global MUST mostrar «Borrador» mientras haya
  pendientes.
- **FR-033**: El dashboard MUST ofrecer una barra lateral oscura, barra superior
  blanca, área de contenido gris azulado, buscadores, selector global, fecha de
  corte alineada a la derecha, estado «BORRADOR» y modo de presentación. El
  encabezado MUST mostrar título grande, subtítulo con norma y proceso, y estado
  «BORRADOR» en ámbar. Los paneles
  MUST presentarse en el orden P1 a P7. La barra lateral MUST iniciar con el nombre
  del proyecto y la norma, sin fotografía, y agrupar «Resumen», «Riesgos»,
  «Simulador» y «Cronograma» bajo «Principal», y «Controles (Anexo A)»,
  «Objetivos» y «Gobernanza» bajo «Cumplimiento». Los nombres de grupo MUST
  mostrarse en mayúsculas grises; el elemento activo MUST tener fondo más oscuro y
  barra azul izquierda. La barra lateral MUST poder colapsarse a iconos.
- **FR-034**: La barra lateral MUST permitir navegar entre las secciones y mostrar
  claramente cuál está activa. La barra lateral MUST ocultarse por debajo de
  1024 px y poder abrirse mediante un botón.
- **FR-035**: Modo presentación MUST ocultar la barra lateral y los elementos
  secundarios, usar texto grande y mostrar un panel por pantalla; MUST permitir
  navegación con flechas y clic, y permitir salir con Esc.
- **FR-036**: La interfaz MUST usar barra lateral #263446, botón de presentación
  #1E9BFF, fondo #EEF2F7, texto #2E3A4B, texto secundario #8A96A8, éxito #2ECC71,
  advertencia #F5A623 y peligro #E74C3C. La barra superior MUST ser blanca con borde
  inferior gris. Los anillos MUST usar #3BB5B0, #1E9BFF y #9B59B6. Las tarjetas
  MUST ser blancas, con borde suave y sombra leve; los gráficos de barras MUST ser
  verde azulado y tener información emergente y píldora de total. Las pestañas MUST
  usar mayúsculas y subrayar la activa en azul. Los títulos MUST ser ligeros y los
  números destacados. La tipografía MUST ser system-ui, Helvetica o Arial.
- **FR-037**: La interfaz MUST adaptarse a 1366 px, proyector y papel. MUST
  mostrar Bajo en verde, Medio en amarillo, Alto en naranja y Crítico en rojo,
  siempre con etiquetas de texto, y definir estilos de impresión.
- **FR-038**: El texto visible MUST estar en español del Perú, tener al menos
  14 px y cumplir contraste AA. Los gráficos y paneles MUST incluir sus fuentes
  informativas correspondientes.
- **FR-039**: El pie global MUST incluir «Proyecto académico. Datos tomados del
  informe de tesis, con fines educativos. Versión de borrador.» y la fecha de
  corte en el formato «Datos al [fechaCorte]. Versión de borrador.» La fecha MUST
  proceder de los datos, no de una fecha escrita a mano en la interfaz.
- **FR-040**: El dashboard MUST NOT incluir formularios para editar datos
  oficiales, botones para exportar o descargar, persistencia en cookies o
  `localStorage`, ni solicitudes de red para obtener los datos del informe.
  Se permiten solicitudes de red únicamente para bibliotecas servidas desde CDN.
  Las únicas interacciones MUST ser: menú y pestañas, selector de ventana, apertura
  de riesgos, selección de barras, selección de celdas, deslizadores y escenarios,
  filtros, búsquedas, información emergente y modo de presentación.
- **FR-041**: El pie de Objetivos MUST mostrar «Fuente: sección 5.3 y Anexo A».
  El pie de Gobernanza MUST mostrar las secciones fuente disponibles en los datos,
  sin inventar referencias.
- **FR-042**: El uso normal MUST funcionar tanto con doble clic en `index.html`
  como en GitHub Pages; la impresión MUST disponer de una presentación legible.

### Key Entities *(include if feature involves data)*

- **Riesgo**: Identificador R-1 a R-6, causa, evento, consecuencia, activo afectado,
  P e I inherentes y residuales, controles, responsable, plazo y referencias de
  fuente.
- **Control del Anexo A**: Número, categoría, inclusión y justificación,
  implementación o medición disponible, métrica, evidencia y condición cuando
  corresponda.
- **Objetivo SGSI**: Nombre, meta, medición disponible y estado calculado frente a
  su meta.
- **Acción de tratamiento**: Riesgo asociado, plazo en días, estado declarado,
  responsable, KRI, evidencia esperada y fechas calculables si existe ratificación.
- **Hito de gobernanza**: Aprobación, firma, presupuesto, auditoría o revisión;
  estado documentado y, cuando corresponda, fecha de ratificación.
- **Ventana de riesgo**: Diagnóstico o post-implementación, con sus valores P e I
  y nivel calculado a partir del producto.
- **Escenario simulado**: Valores temporales de riesgo comparados con valores
  oficiales, sin persistencia ni modificación de la fuente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos 4 de 5 observadores de prueba identifican en menos de
  60 segundos qué cambió entre el diagnóstico y la post-implementación, cuántos
  riesgos se mitigaron y qué queda pendiente.
- **SC-002**: En datos completos, el dashboard muestra exactamente seis riesgos,
  93 controles en las cuatro categorías indicadas, seis acciones y cinco
  objetivos, sin discrepancias con los valores de la fuente del informe.
- **SC-003**: Al cambiar la ventana, todos los paneles dependientes reflejan los
  valores de la ventana elegida sin recarga; los paneles P4 y P5 permanecen
  invariantes.
- **SC-004**: Al sustituir un valor en la fuente de datos válida y volver a cargar,
  todos los paneles relacionados reflejan el nuevo valor, sin cambios manuales en
  la presentación.
- **SC-005**: El dashboard abre con el mismo contenido oficial mediante doble clic
  y publicado en GitHub Pages.
- **SC-006**: Todas las acciones permitidas pueden completarse con controles
  visibles o teclado según corresponda; en modo presentación, navegación con
  flechas y salida con Esc funcionan.
- **SC-007**: En 1366 px, proyector y vista de impresión, títulos, niveles y datos
  esenciales son legibles; por debajo de 1024 px, la navegación lateral sigue
  accesible.
- **SC-008**: Con datos válidos no hay errores de ejecución en la consola; ante
  falta de datos o validación fallida se presenta un aviso visible en vez de una
  pantalla en blanco.
- **SC-009**: Ningún estado, medición ni fecha ausente se presenta como un hecho:
  aparece «Sin medición» o «Pendiente», según corresponda.

## Assumptions

- El dashboard es un producto académico y su contenido no representa una
  aprobación institucional de EsSalud.
- La fuente del informe de tesis y los datos oficiales completos serán
  suministrados en los datos del proyecto antes de evaluar la correspondencia
  numérica; esta especificación no inventa narrativas, mediciones, responsables,
  evidencias ni fechas ausentes.
- Los datos indicados como conteos, plazos, objetivos, escenarios y controles
  condicionados deben leerse de la fuente de datos, aunque la presentación tenga
  que respetar los valores especificados en este documento.
- En el semáforo, «menos de 10 puntos» se interpreta como una brecha inferior a
  10 puntos porcentuales; una brecha de exactamente 10 puntos o mayor es roja.
- En modo normal, las pestañas muestran un panel a la vez; el menú lateral permite
  cambiar de panel.
- «Planificado» solo se muestra si está explícitamente presente en los datos. Si
  no hay estado de una acción o hito, la interfaz muestra «Pendiente».
- La fecha de corte y la fecha de ratificación son datos distintos. Si la fecha
  de ratificación es nula, el cronograma no convierte duraciones en fechas de
  calendario, aunque exista una fecha de corte.
- Las duraciones se interpretan como días calendario. Cuando existe ratificación,
  cada acción inicia en esa fecha y su término se calcula sumando su duración.
- En el simulador, el usuario selecciona el riesgo cuyos valores temporales quiere
  modificar; seleccionar una barra del Resumen destaca el riesgo correspondiente
  en Riesgos.
- Los colores de niveles corresponden a la escala oficial: Bajo verde, Medio
  amarillo, Alto naranja y Crítico rojo; siempre se acompañan de texto.
- El buscador superior cubre riesgos y controles; los paneles pueden ofrecer
  además búsquedas específicas para su contenido.
