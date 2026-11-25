# Tareas: Dashboard SGSI de Riesgos

**Entrada**: Documentos de diseño en `/specs/001-sgsi-dashboard/`

**Prerequisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md` y
`contracts/csv-to-datos.md`.

**Verificación**: tareas manuales por panel incluidas por los criterios de la
especificación y las instrucciones del usuario. No se crea un framework de pruebas
ni una fase de build.

**Organización**: tareas ordenadas por historia de usuario, respetando además la
secuencia solicitada: datos → validación → paneles P1–P7 → simulador →
presentación, impresión y adaptación responsive.

## Bloqueo de datos de origen

El informe con los valores oficiales completos no está en el workspace. T003
requiere ese origen para completar `riesgos.csv`; hasta recibirlo, no se deben
inventar riesgos, controles asociados, responsables, mediciones, estados,
evidencias ni fechas. El resto de tareas de código puede prepararse, pero la
validación con datos reales y la aceptación numérica dependen de completar T003.

## Formato

- Cada tarea sigue `- [ ] Tnnn [P?] [USn?] Descripción con ruta de archivo`.
- `[P]` identifica tareas independientes que pueden ejecutarse en paralelo.
- Las tareas de una historia usan `[US1]` a `[US7]`; Setup, Fundacional y Polish no
  llevan etiqueta de historia.
- La fase del simulador completa US3 después de implementar P1–P7, conforme al
  orden de implementación solicitado.

**Estado de ejecución**: las comprobaciones interactivas del dashboard usaron datos
sintéticos temporales y no acreditan ningún valor oficial. El informe fuente no está
disponible; por ello T003, T005 y los criterios que requieren cotejo con el informe
siguen bloqueados. Chrome/Firefox/GitHub Pages en un teléfono no se verificaron.

## Fase 1: Setup

**Propósito**: preparar el esqueleto estático, sin framework ni configuración de
compilación.

- [x] T001 Crear el esqueleto de los entregables estáticos en `index.html`, `styles.css`, `app.js`, `datos.js`, `riesgos.csv`, `scripts/csv-a-js.js` y `README.md`; crear `scripts/` y dejar ordenados los scripts Chart.js, `datos.js` y `app.js` en `index.html`.

---

## Fase 2: Fundacional — datos y validación

**Propósito**: generar la única fuente runtime y habilitar validación/cálculos antes
de renderizar paneles.

- [x] T002 Definir en `riesgos.csv` el encabezado ancho compartido y las filas tipadas por `tipo` descritas en `specs/001-sgsi-dashboard/contracts/csv-to-datos.md`.
- [ ] T003 Transcribir a `riesgos.csv` todos los riesgos, acciones, controles, relaciones, objetivos, hitos, escenarios, metadatos y fuentes del informe; mantener exactamente R-1 a R-6 y dejar ausentes solo los campos opcionales, sin inventar datos. **Bloqueada: falta el informe fuente.**
- [x] T004 [P] Implementar en `scripts/csv-a-js.js` el lector CSV con comillas/escapes, conversión de tipos, validación de filas y errores explícitos; el script debe producir el objeto completo `window.DATOS_SGSI` en `datos.js` sin dependencias de ejecución del dashboard.
- [ ] T005 Generar `datos.js` completo desde `riesgos.csv` con `scripts/csv-a-js.js` y comprobar que contiene todas las entidades del contrato, sin guardar niveles calculados. **Bloqueada por T003; el marcador permanece nulo.**
- [x] T006 Implementar `validarDatos()` en `app.js`: validar P/I enteros de 1 a 5, exactamente R-1 a R-6 y existencia en el Anexo A de cada control condicionado; mostrar error visible rojo ante datos inválidos.
- [x] T007 Implementar en `app.js` el mensaje exacto «No se encontraron los datos del informe» cuando no exista `window.DATOS_SGSI`, más `nivel(valor)` puro con la escala oficial y `ventanaActiva()` inicializada en DIAGNÓSTICO.
- [x] T008 Ejecutar los casos manuales de datos incorrectos de `specs/001-sgsi-dashboard/quickstart.md` (P=6, cinco riesgos y `datos.js` ausente); restaurar los archivos de datos al terminar.

**Checkpoint**: datos runtime generados y validados; los fallos no dejan la página
en blanco.

---

## Fase 3: US1 — Resumen P1 (Prioridad P1, MVP)

**Meta**: comunicar los riesgos mitigados, controles condicionados, objetivos y
comparación inherente/residual.

**Prueba independiente**: revisar P1 con datos fuente y verificar que muestra los
indicadores, seis riesgos, ambas ventanas comparadas, tooltip, total y pie de fuente;
un observador identifica el resumen en menos de 60 segundos.

- [x] T009 [US1] Añadir en `index.html` la estructura semántica de P1 con tres anillos, gráfico de barras agrupadas, píldora de totales y pie de fuente.
- [x] T010 [US1] Implementar en `app.js` el render de los anillos P1 y sus conteos calculados desde `datos.js`: riesgos que pasan de Alto/Crítico inherente a Bajo residual, controles condicionados sobre tres y objetivos en meta sobre cinco.
- [x] T011 [US1] Implementar en `app.js` el gráfico P1 con Chart.js, ambas series inherente/residual, tooltip P/I/nivel y selección de barra para destacar el riesgo correspondiente.
- [x] T012 [P] [US1] Aplicar en `styles.css` el diseño de tarjetas, anillos SVG, gráfico, etiquetas y pie del panel P1 usando las variables de paleta.
- [ ] T013 [US1] Verificar P1, su fuente y comprensión en menos de 60 segundos mediante `specs/001-sgsi-dashboard/quickstart.md`. **Pendiente: cotejo/comprensión con valores oficiales.**

---

## Fase 4: US2 — Riesgos P2 (Prioridad P1)

**Meta**: ofrecer una tabla de seis riesgos con detalles, niveles de ventana activa y
trazabilidad hasta las secciones fuente.

**Prueba independiente**: abrir cada fila, cambiar la ventana, buscar un riesgo y
seguir una referencia Fuente hasta el dato correspondiente.

- [x] T014 [US2] Añadir en `index.html` la tabla P2 con columnas ID, causa, evento, consecuencia, activo y nivel, además de un contenedor expandible para detalles y búsqueda.
- [x] T015 [US2] Implementar en `app.js` las seis filas y expansión con P×I inherente/residual, controles asociados, responsable, plazo, fuentes por cifra y nivel según `ventanaActiva()`.
- [x] T016 [P] [US2] Aplicar en `styles.css` estilos accesibles para tabla, niveles con etiqueta textual, filas expandidas, enlaces Fuente y resultados de búsqueda P2.
- [x] T017 [US2] Verificar tabla, expansión, selector, búsqueda y resaltado de fila desde una barra P1 según `specs/001-sgsi-dashboard/quickstart.md` (prueba funcional con datos sintéticos).

---

## Fase 5: US3 — Mapa de calor P3 (Prioridad P2)

**Meta**: ubicar los riesgos en la matriz oficial según la ventana activa.

**Prueba independiente**: cambiar la ventana y comprobar posiciones, nivel, etiquetas
y contorno inherente/relleno residual en POST-IMPLEMENTACIÓN.

- [x] T018 [US3] Añadir en `index.html` la matriz P3 de 5×5 con ejes de probabilidad/impacto, leyenda textual de niveles y pie de fuente.
- [x] T019 [US3] Implementar en `app.js` el render del mapa P3 desde los valores oficiales de `ventanaActiva()`, con zonas de la escala oficial y marcas inherente/residual exigidas para POST-IMPLEMENTACIÓN.
- [x] T020 [P] Construir en `styles.css` la cuadrícula 5×5, marcas de riesgo, contraste de las zonas y presentación responsive del mapa P3.
- [x] T021 [US3] Verificar posiciones, cambio de ventana, etiquetas y representación POST mediante `specs/001-sgsi-dashboard/quickstart.md` (prueba funcional con datos sintéticos).

---

## Fase 6: US4 — Cronograma P4 (Prioridad P2)

**Meta**: mostrar la duración y estado documentado de cada acción de tratamiento,
sin inventar fechas.

**Prueba independiente**: filtrar por riesgo, inspeccionar responsable/KRI/evidencia
y probar fechas con ratificación nula y definida.

- [x] T022 [US4] Añadir en `index.html` el panel P4 con seis filas de riesgo, área de barras Gantt, filtro y pie del plan.
- [x] T023 [US4] Implementar en `app.js` barras proporcionales a plazos, filtro, tooltip de responsable/KRI/evidencia y estados solo desde datos; con ratificación nula ocultar fechas y «Hoy», y con fecha válida calcular desde ratificación usando `fechaCorte` para «Hoy».
- [x] T024 [P] Aplicar en `styles.css` la cuadrícula y barras del Gantt, colores de estado y presentación solo por duración cuando falte fecha de ratificación.
- [x] T025 [US4] Verificar plazos, filtro, estados, campos ausentes y ambos casos de fecha en `specs/001-sgsi-dashboard/quickstart.md` (prueba funcional con datos sintéticos).

---

## Fase 7: US5 — Controles P5 (Prioridad P2)

**Meta**: mostrar la cobertura del Anexo A, controles condicionados y matriz
control-riesgo con búsqueda.

**Prueba independiente**: buscar un control, consultar una celda de relación y
confirmar categorías, condiciones, evidencia y pie de fuente.

- [x] T026 [US5] Añadir en `index.html` las secciones P5 para tarjetas de controles, controles condicionados, matriz control-riesgo y búsqueda por número.
- [x] T027 [US5] Implementar en `app.js` el render de 93 controles y cobertura por categoría, lista condicionada con condición/evidencia, relaciones R-1–R-6 y búsqueda con detalle de control.
- [x] T028 [P] Aplicar en `styles.css` estilos de tarjetas y avances por categoría, matriz y resultados de búsqueda P5.
- [x] T029 [US5] Verificar conteos 37/8/14/34, fallback «Sin medición», controles condicionados existentes, matriz y búsqueda en `specs/001-sgsi-dashboard/quickstart.md` (prueba funcional con datos sintéticos).

---

## Fase 8: US6 — Objetivos P6 y gobernanza P7 (Prioridad P2)

**Meta**: comparar cinco objetivos contra sus metas y presentar pendientes de
gobernanza.

**Prueba independiente**: comprobar semáforos con mediciones presentes/ausentes y
estados de hitos completos/pendientes.

- [x] T030 [US6] Añadir en `index.html` los contenedores P6 para cinco anillos/semáforos y P7 para hitos, ratificación y estado global.
- [x] T031 [US6] Implementar en `app.js` anillos y semáforos de P6 desde metas/mediciones de `datos.js`; mostrar gris y «Sin medición» cuando falte medición.
- [x] T032 [US6] Implementar en `app.js` P7 con los cinco hitos, fallback «Pendiente», fecha de ratificación pendiente si es nula y píldora global «Borrador» mientras haya pendientes.
- [x] T033 [P] Aplicar en `styles.css` los anillos/semáforos de objetivos y la lista de gobernanza con niveles de texto y estados accesibles.
- [x] T034 [US6] Verificar metas, umbral de 10 puntos porcentuales, ausencias, ratificación y estado global en `specs/001-sgsi-dashboard/quickstart.md` (lógica inspeccionada y render probado con datos sintéticos).

---

## Fase 9: US7 — Navegación normal y búsqueda global (Prioridad P3)

**Meta**: navegar por un panel activo a la vez y localizar riesgos/controles sin
añadir interacciones fuera del alcance.

**Prueba independiente**: cambiar de pestaña/sección, usar el buscador global y el
selector; confirmar que solo se muestra un panel y que P4/P5 no cambian de ventana.

- [x] T035 [US7] Implementar en `index.html` la barra lateral, grupos Principal/Cumplimiento, pestañas en mayúsculas, barra superior, selector, fecha de corte y encabezado con ventana activa.
- [x] T036 [P] Aplicar en `styles.css` la navegación normal, estados activo/colapsado y barra superior conforme a la paleta especificada.
- [x] T037 [US7] Implementar en `app.js` `navegacion()` para pestañas, menú activo, búsqueda global de riesgos/controles y conexión del selector con P2/P3/simulador; mantener P1 comparativo y P4/P5 invariantes.
- [x] T038 [US7] Verificar pestañas, un panel visible, grupos, búsqueda, ventana activa y comportamiento invariante en `specs/001-sgsi-dashboard/quickstart.md` (prueba funcional con datos sintéticos).

---

## Fase 10: US3 — Simulador P3 (completar historia)

**Meta**: probar escenarios didácticos desde la ventana activa sin modificar datos
oficiales ni persistir cambios.

**Prueba independiente**: mover deslizadores, cambiar ventana, ejecutar los cuatro
escenarios y restablecer valores; comparar resultados oficiales y simulados.

- [x] T039 [US3] Añadir en `index.html` los deslizadores P/I por riesgo, comparación oficial/simulada, banda permanente, botón de restablecimiento y escenarios.
- [x] T040 [US3] Implementar en `app.js` el estado temporal del simulador y su actualización en tiempo real; al cambiar de ventana restablecer al nuevo punto de partida y mostrar «Cambiar de ventana restablece el simulador».
- [x] T041 [US3] Implementar en `app.js` los escenarios cargados desde `datos.js` (Sin MFA, Sin WAF, Sin enlace secundario y reducción de impacto con respaldos), actualizar mapa/gráfico y etiquetar la reducción como no oficial.
- [x] T042 [P] Aplicar en `styles.css` estilos de deslizadores, comparación, banda de simulación, escenarios y resultado del simulador P3.
- [x] T043 [US3] Verificar los cuatro escenarios, límites 1–5, cambio de ventana, restablecimiento y ausencia de escrituras a `datos.js`, cookies o `localStorage` mediante `specs/001-sgsi-dashboard/quickstart.md` (prueba funcional con datos sintéticos).

---

## Fase 11: Polish y validación transversal

**Propósito**: presentación, responsive, impresión, documentación y revisión final.

- [x] T044 [P] Implementar en `app.js` el modo presentación: un panel por pantalla, navegación por flechas/clic, salida con Esc y ocultación de elementos secundarios.
- [x] T045 [P] Implementar en `styles.css` la vista responsive (ocultar/abrir barra lateral bajo 1024 px), variables `:root` de paleta y reglas `@media print`.
- [x] T046 [P] Documentar en `README.md` cómo abrir por doble clic, editar `riesgos.csv`, regenerar/editar `datos.js` manualmente, usar el generador Node opcional y publicar en GitHub Pages; advertir sobre conectividad del CDN y datos públicos.
- [ ] T047 Verificar manualmente en Chrome, Firefox y GitHub Pages desde un celular con datos móviles; revisar 1366 px, proyector, teclado, modo presentación, impresión y consola usando `specs/001-sgsi-dashboard/quickstart.md`. **Pendiente: Firefox y despliegue móvil/GitHub Pages no disponibles; impresión verificada en Chromium.**
- [ ] T048 Revisar cada criterio de aceptación de `specs/001-sgsi-dashboard/spec.md` y la constitución; confirmar que no haya cifras hardcodeadas en `app.js`, `index.html` o `styles.css`, interacciones prohibidas ni datos inventados. **Revisión técnica parcial; aceptación numérica y de despliegue bloqueada por falta del informe y pruebas externas.**

---

## Dependencias y orden de ejecución

### Dependencias de fases

- **Setup (Fase 1)**: independiente; prepara archivos y rutas.
- **Fundacional (Fase 2)**: T002 define el formato; T003 y T004 pueden ejecutarse
  en paralelo tras T002; T005 requiere ambos. T006–T008 requieren datos generados
  y funciones base.
- **Paneles (Fases 3–9)**: requieren la Fase 2 y se implementan en el orden P1,
  P2, P3 mapa, P4, P5, P6/P7 y navegación normal para respetar la secuencia
  solicitada.
- **Simulador (Fase 10)**: completa US3 después de los paneles; depende de P3,
  datos/escenarios y navegación de ventana.
- **Polish (Fase 11)**: depende de los paneles y simulador; termina con verificación
  manual integral.

### Orden de historias de usuario

| Historia | Entrega | Dependencia |
|---|---|---|
| US1 (P1) | Resumen y comparación | Fundacional |
| US2 (P2) | Tabla y trazabilidad | US1, por orden solicitado |
| US3 (P3) | Mapa en Fase 5; simulador en Fase 10 | Fundacional; simulador espera P1–P7 |
| US4 (P4) | Cronograma | US3 mapa |
| US5 (P5) | Controles | US4 |
| US6 (P6/P7) | Objetivos y gobernanza | US5 |
| US7 | Navegación normal | US6 |

### Oportunidades paralelas

- Tras T002, T003 (carga del informe a `riesgos.csv`) y T004 (parser/generador en
  `scripts/csv-a-js.js`) son archivos separados; T005 los integra.
- En Polish, T044 (`app.js`), T045 (`styles.css`) y T046 (`README.md`) son tareas
  separables; T047/T048 esperan que las tres terminen.
- No se paralizan fases de paneles entre sí: se conserva el orden pedido P1–P7.

| Historia | Ejemplo de tareas paralelas |
|---|---|
| US1 | T009 (marcado P1 en `index.html`) + T012 (estilos P1 en `styles.css`) |
| US2 | T014 (tabla P2 en `index.html`) + T016 (estilos P2 en `styles.css`) |
| US3 | T018 (mapa en `index.html`) + T020 (cuadrícula en `styles.css`); T039 (controles del simulador en `index.html`) + T042 (estilos del simulador en `styles.css`) |
| US4 | T022 (estructura Gantt en `index.html`) + T024 (estilos Gantt en `styles.css`) |
| US5 | T026 (estructura controles en `index.html`) + T028 (estilos P5 en `styles.css`) |
| US6 | T030 (estructura P6/P7 en `index.html`) + T033 (estilos P6/P7 en `styles.css`) |
| US7 | T035 (estructura de navegación en `index.html`) + T036 (estilos de navegación en `styles.css`) |

## Estrategia de implementación

### MVP

1. Completar Setup y Fundacional; T003 requiere el informe fuente real.
2. Completar US1 P1 y ejecutar T013. Detenerse si faltan valores oficiales.
3. Continuar P2–P7 en orden; después completar simulador y presentación.

### Entrega incremental

Cada panel tiene una prueba manual independiente descrita en `quickstart.md`. No se
añaden pruebas automatizadas ni infraestructura de build; los errores del generador
y las validaciones del navegador se comprueban con casos controlados.

## Notas

- Todo número/estado/fecha oficial se toma de `datos.js`; los escenarios se cargan
  como datos y el simulador solo mantiene una copia temporal.
- Los niveles son derivados de P×I y nunca se guardan en el CSV ni en `datos.js`.
- Un estado o medición ausente se representa como «Pendiente» o «Sin medición».
- No crear tareas para backend, framework, base de datos, exportación, descarga ni
  edición de datos oficiales en la interfaz.
