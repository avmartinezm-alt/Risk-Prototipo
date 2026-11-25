// datos.js
// Fuente única de cifras del dashboard. Editar aquí; no tocar index.html ni app.js.
// Fuente: Informe SGSI EsSalud (sección 5.1.3, 5.1.4, 5.2.3, 5.2.4 y Anexo A).
window.DATOS_SGSI = (() => {

  // ───────── METADATOS ─────────
  const metadatos = {
    fechaCorte: "2026-11-25",          // fecha en que se preparó el dashboard
    norma: "ISO/IEC 27001:2022",
    totalControles: 93,
    fechaRatificacion: null            // null = pendiente; no inventar una fecha
  };

  // ───────── RIESGOS (5.1.3, 5.1.4, 5.2.3) ─────────
  const riesgos = [
    { id: "R-1", causa: "Redundancia insuficiente en servidores locales", evento: "Falla física o sobrecarga de servidores de base de datos", consecuencia: "Interrupción de la acreditación de coberturas y del registro en línea", activo: "Padrón de asegurados", pInh: 4, iInh: 5, pRes: 1, iRes: 4 },
    { id: "R-2", causa: "Validación insuficiente de entradas y falta de parches", evento: "Ataque web (DDoS) o explotación de fallas en el portal", consecuencia: "Caída de trámites digitales", activo: "Portal y trámites", pInh: 4, iInh: 5, pRes: 1, iRes: 5 },
    { id: "R-3", causa: "Control de acceso débil y falta de cifrado", evento: "Fuga o filtración de información confidencial", consecuencia: "Exposición de datos personales y de salud de asegurados", activo: "Base de datos centralizada", pInh: 4, iInh: 4, pRes: 1, iRes: 4 },
    { id: "R-4", causa: "Contraseñas débiles y ausencia de MFA", evento: "Compromiso o abuso de credenciales del personal", consecuencia: "Acceso indebido al padrón", activo: "Personal autorizado", pInh: 3, iInh: 4, pRes: 2, iRes: 2 },
    { id: "R-5", causa: "Enlace único de fibra sin respaldo", evento: "Caída del enlace de telecomunicaciones del proveedor", consecuencia: "Interrupción de la consulta en línea", activo: "Conectividad en línea", pInh: 3, iInh: 4, pRes: 1, iRes: 3 },
    { id: "R-6", causa: "Canales no cifrados (HTTP sin VPN)", evento: "Intercepción de tráfico (Man in the Middle)", consecuencia: "Pérdida de confidencialidad en tránsito", activo: "Redes y comunicaciones", pInh: 3, iInh: 4, pRes: 1, iRes: 3 }
  ];

  // ───────── ACCIONES DEL PLAN (5.2.4) ─────────
  const acciones = [
    { id: "A-1", riesgoId: "R-1", nombre: "Clúster de alta disponibilidad en BD", plazoDias: 90, responsable: "Jefe de Infraestructura y Soporte TI / DBA", estado: "Planificado", kri: "Tiempo de recuperación (RTO / RPO)", evidencia: "Informe de arquitectura HA; acta de prueba" },
    { id: "A-2", riesgoId: "R-2", nombre: "WAF y análisis SAST/DAST", plazoDias: 120, responsable: "Jefe de Sistemas y Desarrollo", estado: "Planificado", kri: "% de aplicaciones web protegidas por WAF", evidencia: "Configuración del WAF; reportes de escaneo" },
    { id: "A-3", riesgoId: "R-3", nombre: "Cifrado de base de datos y RBAC", plazoDias: 60, responsable: "Responsable de Seguridad de la Información (CISO)", estado: "Planificado", kri: "% de tablas o bases críticas cifradas", evidencia: "Configuración de cifrado; logs de auditoría" },
    { id: "A-4", riesgoId: "R-4", nombre: "MFA obligatorio para personal administrativo", plazoDias: 60, responsable: "Responsable del SGSI / Administración de Usuarios TI", estado: "Planificado", kri: "% de cuentas administrativas con MFA activo", evidencia: "Reporte IAM/MFA; registros de capacitación" },
    { id: "A-5", riesgoId: "R-5", nombre: "Enlace secundario de fibra con conmutación automática", plazoDias: 90, responsable: "Gestor de Contratos / Jefe de Comunicaciones", estado: "Planificado", kri: "% de disponibilidad de la red WAN", evidencia: "Contrato firmado; acta de prueba de conmutación" },
    { id: "A-6", riesgoId: "R-6", nombre: "HTTPS, VPN y segmentación VLAN", plazoDias: 45, responsable: "Responsable de Redes e Infraestructura", estado: "Planificado", kri: "% de tráfico web encriptado (HTTPS)", evidencia: "Certificados vigentes; diagrama de VLANs" }
  ];

  // ───────── CONTROLES DEL ANEXO A (93) ─────────
  // Tupla: [número, nombre, categoría (O, P, F, T), métrica, evidencia]
  const CAT = { O: "Organizacional", P: "De personas", F: "Físico", T: "Tecnológico" };
  const CONDICIONES = {
    "5.23": "Requiere verificar si algún servicio en nube sostiene el padrón o el portal",
    "7.9": "Requiere verificar si hay equipos fuera de sede que accedan al padrón",
    "8.30": "Requiere verificar si terceros desarrollan o mantienen el portal"
  };
  const anexoA = [
    ["5.1", "Políticas de seguridad de la información", "O", "% de políticas aprobadas y publicadas", "Política firmada; registro de difusión"],
    ["5.2", "Roles y responsabilidades", "O", "% de roles con responsable asignado", "Matriz RACI"],
    ["5.3", "Segregación de deberes", "O", "Nº de conflictos de deberes detectados", "Matriz de segregación"],
    ["5.4", "Responsabilidades de gestión", "O", "% de jefes con objetivos de seguridad", "Actas de revisión; objetivos de área"],
    ["5.5", "Contacto con autoridades", "O", "Contactos actualizados / contactos requeridos", "Lista de contactos"],
    ["5.6", "Contacto con grupos de interés especial", "O", "Nº de alertas recibidas y atendidas", "Registro de membresía o foros"],
    ["5.7", "Inteligencia de amenazas", "O", "Nº de alertas relevantes analizadas / recibidas", "Registro de alertas"],
    ["5.8", "Seguridad en gestión de proyectos", "O", "% de proyectos con evaluación de seguridad", "Checklist por proyecto"],
    ["5.9", "Inventario de información y activos", "O", "% de activos inventariados con propietario", "Inventario de activos"],
    ["5.10", "Uso aceptable", "O", "% de personal que firmó reglas de uso", "Reglas firmadas"],
    ["5.11", "Devolución de activos", "O", "% de bajas con devolución registrada", "Checklist de salida"],
    ["5.12", "Clasificación de la información", "O", "% de activos clasificados", "Esquema de clasificación"],
    ["5.13", "Etiquetado de información", "O", "% de documentos etiquetados (muestra)", "Guía de etiquetado"],
    ["5.14", "Transferencia de información", "O", "Nº de envíos de datos por canal no autorizado", "Reglas de transferencia"],
    ["5.15", "Control de acceso", "O", "% de accesos con aprobación formal", "Matriz RBAC"],
    ["5.16", "Gestión de identidad", "O", "Días promedio de baja de identidades", "Formato de alta/baja"],
    ["5.17", "Información de autenticación", "O", "% de cuentas con política de contraseñas", "Política de contraseñas"],
    ["5.18", "Derechos de acceso", "O", "% de accesos recertificados a tiempo", "Actas de recertificación"],
    ["5.19", "Seguridad en relaciones con proveedores", "O", "% de proveedores críticos evaluados", "Matriz de proveedores"],
    ["5.20", "Seguridad en acuerdos con proveedores", "O", "% de contratos con cláusulas de seguridad", "Contratos firmados"],
    ["5.21", "Seguridad en la cadena de suministro TIC", "O", "% de componentes con origen verificado", "Registro de proveedores TIC"],
    ["5.22", "Seguimiento de servicios de proveedores", "O", "% de disponibilidad del proveedor vs. SLA", "Informes semestrales"],
    ["5.23", "Seguridad en servicios en la nube", "O", "% de servicios en nube con requisitos definidos", "Checklist de nube"],
    ["5.24", "Planificación de gestión de incidentes", "O", "Existencia del plan (sí/no)", "Plan de respuesta"],
    ["5.25", "Evaluación de eventos de seguridad", "O", "Tiempo medio de clasificación de eventos", "Registro de eventos"],
    ["5.26", "Respuesta a incidentes", "O", "Tiempo medio de respuesta", "Registros de incidentes"],
    ["5.27", "Aprendizaje de incidentes", "O", "% de incidentes con lección aprendida", "Análisis post-incidente"],
    ["5.28", "Recolección de evidencia", "O", "% de incidentes con evidencia preservada", "Procedimiento de evidencia"],
    ["5.29", "Seguridad durante interrupciones", "O", "Tiempo de operación en modo contingencia", "Procedimiento de contingencia"],
    ["5.30", "Preparación TIC para la continuidad", "O", "RTO y RPO medidos vs. aprobados", "DRP; acta de prueba"],
    ["5.31", "Requisitos legales y contractuales", "O", "% de requisitos legales con control asociado", "Matriz legal"],
    ["5.32", "Derechos de propiedad intelectual", "O", "% de software con licencia vigente", "Inventario de licencias"],
    ["5.33", "Protección de registros", "O", "% de registros con respaldo y control de acceso", "Política de retención"],
    ["5.34", "Privacidad y protección de PII", "O", "% de tratamientos de datos con cumplimiento", "Inventario de tratamiento de datos"],
    ["5.35", "Revisión independiente de la seguridad", "O", "Nº de hallazgos de revisión independiente", "Informe de revisión"],
    ["5.36", "Cumplimiento de políticas y normas", "O", "% de políticas con verificación de cumplimiento", "Informe de cumplimiento"],
    ["5.37", "Procedimientos operativos documentados", "O", "% de procedimientos críticos documentados", "Listado de procedimientos"],
    ["6.1", "Verificación de antecedentes", "P", "% de personal con verificación previa", "Registro de selección"],
    ["6.2", "Términos y condiciones de empleo", "P", "% de contratos con cláusula de seguridad", "Contratos"],
    ["6.3", "Concientización, educación y capacitación", "P", "% de personal capacitado; resultado de simulacros", "Listas de asistencia; simulacros"],
    ["6.4", "Proceso disciplinario", "P", "Nº de sanciones aplicadas por incumplimiento", "Procedimiento disciplinario"],
    ["6.5", "Responsabilidades tras el cese", "P", "% de ex-personal con accesos revocados", "Checklist de cese"],
    ["6.6", "Acuerdos de confidencialidad", "P", "% de personal y terceros con acuerdo firmado", "Acuerdos firmados"],
    ["6.7", "Trabajo remoto", "P", "% de accesos remotos por VPN con equipo autorizado", "Política de trabajo remoto"],
    ["6.8", "Informes de eventos de seguridad", "P", "Nº de reportes recibidos; tiempo de atención", "Registro de reportes"],
    ["7.1", "Perímetros de seguridad", "F", "Nº de perímetros definidos y verificados", "Plano de zonas"],
    ["7.2", "Entrada física", "F", "% de ingresos registrados", "Registro de ingreso"],
    ["7.3", "Seguridad de oficinas, salas e instalaciones", "F", "Nº de hallazgos en inspección física", "Diseño de seguridad física"],
    ["7.4", "Monitoreo de seguridad física", "F", "Nº de accesos no autorizados detectados", "Registros de cámaras y rondas"],
    ["7.5", "Protección contra amenazas físicas y ambientales", "F", "Cumplimiento de medidas ambientales", "Plan de protección ambiental"],
    ["7.6", "Trabajo en áreas seguras", "F", "% de personal con normas de áreas seguras", "Normas firmadas"],
    ["7.7", "Escritorio y pantalla despejados", "F", "% de inspecciones sin hallazgos", "Norma de escritorio limpio"],
    ["7.8", "Emplazamiento y protección de equipos", "F", "% de equipos ubicados según norma", "Inventario de ubicación"],
    ["7.9", "Seguridad de activos fuera de instalaciones", "F", "% de equipos externos con cifrado", "Registro de equipos externos"],
    ["7.10", "Medios de almacenamiento", "F", "% de medios con ciclo de vida registrado", "Registro de medios"],
    ["7.11", "Utilidades de apoyo", "F", "Tiempo de autonomía de UPS (prueba)", "Pruebas de UPS; mantenimiento"],
    ["7.12", "Seguridad del cableado", "F", "Nº de tramos de cableado no protegidos", "Diagrama de canalización"],
    ["7.13", "Mantenimiento de equipos", "F", "% de mantenimientos ejecutados según plan", "Plan y reportes de mantenimiento"],
    ["7.14", "Eliminación segura de equipos", "F", "% de equipos con borrado verificado", "Actas de borrado"],
    ["8.1", "Dispositivos de punto final de usuario", "T", "% de equipos con protección activa", "Reporte EDR/antivirus"],
    ["8.2", "Derechos de acceso privilegiado", "T", "% de cuentas privilegiadas revisadas", "Lista de cuentas privilegiadas"],
    ["8.3", "Restricción de acceso a la información", "T", "% de accesos con mínimo privilegio", "Matriz RBAC"],
    ["8.4", "Acceso al código fuente", "T", "% de repositorios con control de acceso", "Configuración del repositorio"],
    ["8.5", "Autenticación segura", "T", "% de cuentas administrativas con MFA (meta 100 %)", "Reporte IAM/MFA"],
    ["8.6", "Gestión de capacidad", "T", "% de tiempo con uso de recursos por encima del umbral", "Reporte de capacidad"],
    ["8.7", "Protección contra malware", "T", "% de equipos protegidos", "Reporte antimalware"],
    ["8.8", "Gestión de vulnerabilidades técnicas", "T", "% de vulnerabilidades críticas remediadas en plazo", "Reportes SAST/DAST y escaneo"],
    ["8.9", "Gestión de la configuración", "T", "% de equipos con línea base aplicada", "Líneas base"],
    ["8.10", "Eliminación de información", "T", "% de eliminaciones con registro", "Actas de eliminación"],
    ["8.11", "Enmascaramiento de datos", "T", "% de entornos de prueba con datos enmascarados", "Reglas de enmascaramiento"],
    ["8.12", "Prevención de fuga de datos", "T", "Nº de eventos de fuga bloqueados", "Reglas DLP"],
    ["8.13", "Copia de seguridad de la información", "T", "% de restauraciones exitosas", "Logs de backup; actas de restauración"],
    ["8.14", "Redundancia de instalaciones de procesamiento", "T", "Disponibilidad mensual (meta ≥ 97 %)", "Diagrama HA; contrato de enlace secundario"],
    ["8.15", "Registro de eventos", "T", "% de eventos críticos registrados", "Logs protegidos"],
    ["8.16", "Actividades de monitoreo", "T", "Tiempo medio de detección", "Reportes de monitoreo"],
    ["8.17", "Sincronización de reloj", "T", "Desfase de reloj máximo medido", "Configuración NTP"],
    ["8.18", "Uso de programas de utilidad privilegiados", "T", "Nº de herramientas restringidas autorizadas", "Lista de herramientas"],
    ["8.19", "Instalación de software en sistemas operativos", "T", "% de instalaciones con aprobación", "Registro de instalaciones"],
    ["8.20", "Seguridad en redes", "T", "% de tráfico cifrado", "Configuración de red; certificados"],
    ["8.21", "Seguridad de servicios de red", "T", "% de servicios de red con SLA definido", "Acuerdos de nivel de servicio"],
    ["8.22", "Segregación de redes", "T", "Nº de segmentos aislados verificados", "Diagrama de VLANs"],
    ["8.23", "Filtrado web", "T", "Nº de bloqueos por categoría de riesgo", "Reglas de filtrado"],
    ["8.24", "Uso de criptografía", "T", "% de datos sensibles cifrados en reposo y tránsito", "Configuración de cifrado; política de claves"],
    ["8.25", "Ciclo de vida de desarrollo seguro", "T", "% de cambios con revisión de seguridad", "Política de desarrollo seguro"],
    ["8.26", "Requisitos de seguridad de aplicaciones", "T", "% de requisitos de seguridad aprobados", "Especificaciones"],
    ["8.27", "Arquitectura e ingeniería de sistemas seguros", "T", "Existencia de principios aprobados (sí/no)", "Documento de principios"],
    ["8.28", "Codificación segura", "T", "% de hallazgos de codificación corregidos", "Checklist de código"],
    ["8.29", "Pruebas de seguridad en desarrollo y aceptación", "T", "Nº de vulnerabilidades halladas antes de producción", "Reportes SAST/DAST; pentest"],
    ["8.30", "Desarrollo subcontratado", "T", "% de proyectos subcontratados con supervisión", "Contratos y actas de supervisión"],
    ["8.31", "Separación de entornos", "T", "% de entornos separados verificados", "Documentación de entornos"],
    ["8.32", "Gestión del cambio", "T", "% de cambios con aprobación y plan de reversión", "Formato de cambio"],
    ["8.33", "Información de prueba", "T", "% de pruebas con datos enmascarados", "Registro de datos de prueba"],
    ["8.34", "Protección durante pruebas de auditoría", "T", "Nº de pruebas de auditoría planificadas y acordadas", "Plan de auditoría acordado"]
  ];
  const controles = anexoA.map(([numero, nombre, cat, metrica, evidencia]) => ({
    numero,
    nombre,
    categoria: CAT[cat],
    incluido: true,
    condicion: CONDICIONES[numero] || null,
    justificacion: null,              // se completa con la columna "Justificación de inclusión" del Anexo A
    metrica,
    evidencia,
    seccion: "Anexo A"
  }));

  // ───────── RELACIONES CONTROL → RIESGO (5.2.1 y Anexo A) ─────────
  const relaciones = [
    { id: "REL-01", riesgoId: "R-1", numeroControl: "8.14", justificacion: "Redundancia de instalaciones de procesamiento" },
    { id: "REL-02", riesgoId: "R-1", numeroControl: "8.13", justificacion: "Respaldo de información" },
    { id: "REL-03", riesgoId: "R-1", numeroControl: "8.16", justificacion: "Monitoreo de actividades" },
    { id: "REL-04", riesgoId: "R-2", numeroControl: "8.25", justificacion: "Ciclo de vida de desarrollo seguro" },
    { id: "REL-05", riesgoId: "R-2", numeroControl: "8.29", justificacion: "Pruebas de seguridad en desarrollo" },
    { id: "REL-06", riesgoId: "R-2", numeroControl: "8.8", justificacion: "Gestión de vulnerabilidades técnicas" },
    { id: "REL-07", riesgoId: "R-3", numeroControl: "5.15", justificacion: "Control de acceso" },
    { id: "REL-08", riesgoId: "R-3", numeroControl: "8.24", justificacion: "Uso de criptografía" },
    { id: "REL-09", riesgoId: "R-4", numeroControl: "5.17", justificacion: "Información de autenticación" },
    { id: "REL-10", riesgoId: "R-4", numeroControl: "8.5", justificacion: "Autenticación segura (MFA)" },
    { id: "REL-11", riesgoId: "R-4", numeroControl: "6.3", justificacion: "Concientización y capacitación" },
    { id: "REL-12", riesgoId: "R-5", numeroControl: "8.14", justificacion: "Redundancia de instalaciones" },
    { id: "REL-13", riesgoId: "R-5", numeroControl: "5.22", justificacion: "Seguimiento de servicios de proveedores" },
    { id: "REL-14", riesgoId: "R-5", numeroControl: "5.21", justificacion: "Seguridad en la cadena de suministro TIC" },
    { id: "REL-15", riesgoId: "R-6", numeroControl: "8.20", justificacion: "Seguridad en redes" },
    { id: "REL-16", riesgoId: "R-6", numeroControl: "8.21", justificacion: "Seguridad de servicios de red" },
    { id: "REL-17", riesgoId: "R-6", numeroControl: "8.22", justificacion: "Segregación de redes" }
  ];

  // ───────── OBJETIVOS (5.3 y Anexo) ─────────
  // medicion: null = "Sin medición" (no inventar valores)
  const objetivos = [
    { id: "OBJ-1", nombre: "MFA en cuentas administrativas", metrica: "Cuentas administrativas con MFA", meta: 100, unidad: "%", medicion: null, frecuencia: "Mensual", responsable: "Administración TI", seccion: "5.3" },
    { id: "OBJ-2", nombre: "Restauraciones exitosas en pruebas", metrica: "Éxito en restauración de datos", meta: 100, unidad: "%", medicion: null, frecuencia: "Trimestral", responsable: "DBA", seccion: "5.3" },
    { id: "OBJ-3", nombre: "Disponibilidad del registro en línea", metrica: "Disponibilidad del registro en línea", meta: 97, unidad: "%", medicion: null, frecuencia: "Mensual", responsable: "Infraestructura", seccion: "5.3" },
    { id: "OBJ-4", nombre: "Vulnerabilidades críticas y altas remediadas en plazo", metrica: "Vulnerabilidades remediadas en plazo", meta: 100, unidad: "%", medicion: null, frecuencia: "Mensual", responsable: "Jefe de Sistemas y Desarrollo", seccion: "5.3" },
    { id: "OBJ-5", nombre: "Proveedores críticos evaluados", metrica: "Proveedores críticos evaluados", meta: 100, unidad: "%", medicion: null, frecuencia: "Semestral", responsable: "Gestor de Contratos", seccion: "5.3" }
  ];

  // ───────── HITOS DE GOBERNANZA (4.1, 5.2.5, 6.1, 8.2, 8.3) ─────────
  const hitos = [
    { id: "HIT-1", nombre: "Aprobación del SGSI por la alta dirección", estado: "Pendiente", fecha: null },
    { id: "HIT-2", nombre: "Firmas de los 6 propietarios de riesgo", estado: "Pendiente", fecha: null },
    { id: "HIT-3", nombre: "Presupuesto aprobado", estado: "Pendiente", fecha: null },
    { id: "HIT-4", nombre: "Programa anual de auditoría interna y primer informe", estado: "Pendiente", fecha: null },
    { id: "HIT-5", nombre: "Primera revisión por la dirección", estado: "Pendiente", fecha: null }
  ];

  // ───────── ESCENARIOS DEL SIMULADOR (no oficiales) ─────────
  const escenarios = [
    { id: "ESC-1", nombre: "Sin MFA", riesgoId: "R-4", variable: "probabilidad", valorInicial: 2, valorSimulado: 3, etiqueta: "Escenario didáctico" },
    { id: "ESC-2", nombre: "Sin WAF", riesgoId: "R-2", variable: "probabilidad", valorInicial: 1, valorSimulado: 4, etiqueta: "Escenario didáctico" },
    { id: "ESC-3", nombre: "Sin enlace secundario", riesgoId: "R-5", variable: "probabilidad", valorInicial: 1, valorSimulado: 3, etiqueta: "Escenario didáctico" },
    { id: "ESC-4", nombre: "Reducción de impacto con respaldos", riesgoId: "R-1", variable: "impacto", valorInicial: 4, valorSimulado: 2, etiqueta: "No oficial" }
  ];

  // ───────── FUENTES (trazabilidad por campo) ─────────
  const fuentes = [
    ...riesgos.flatMap((r) => [
      { entidadTipo: "riesgo", entidadId: r.id, campo: "causa", seccion: "5.1.3" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "evento", seccion: "5.1.3" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "consecuencia", seccion: "5.1.3" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "activo", seccion: "5.1.3" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "pInh", seccion: "5.1.4" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "iInh", seccion: "5.1.4" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "pRes", seccion: "5.2.3" },
      { entidadTipo: "riesgo", entidadId: r.id, campo: "iRes", seccion: "5.2.3" }
    ]),
    ...acciones.map((a) => ({ entidadTipo: "accion", entidadId: a.id, campo: "plazoDias", seccion: "5.2.4" })),
    ...relaciones.map((rel) => ({ entidadTipo: "relacion_control_riesgo", entidadId: rel.id, campo: "justificacion", seccion: "5.2.1" }))
  ];

  const fuentesPanel = [
    { panelId: "resumen", seccion: "5.1.4 y 5.2.3" },
    { panelId: "riesgos", seccion: "5.1.3, 5.1.4 y 5.2.3" },
    { panelId: "cronograma", seccion: "5.2.4" },
    { panelId: "controles", seccion: "Anexo A y 5.2.2" },
    { panelId: "objetivos", seccion: "5.3 y 8.1" },
    { panelId: "gobernanza", seccion: "4.1, 5.2.5, 6.1, 8.2 y 8.3" }
  ];

  return {
    metadatos,
    riesgos,
    acciones,
    controles,
    relaciones,
    objetivos,
    hitos,
    escenarios,
    fuentes,
    fuentesPanel
  };
})();