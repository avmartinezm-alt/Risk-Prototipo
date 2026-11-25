'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'riesgos.csv');
const outputPath = path.join(root, 'datos.js');
const columns = [
  'tipo', 'id', 'valor', 'nombre', 'causa', 'evento', 'consecuencia', 'activo',
  'pInh', 'iInh', 'pRes', 'iRes', 'riesgoId', 'plazoDias', 'responsable',
  'estado', 'kri', 'evidencia', 'categoria', 'incluido', 'condicion',
  'justificacion', 'metrica', 'numeroControl', 'meta', 'unidad', 'medicion',
  'fecha', 'variable', 'valorInicial', 'valorSimulado', 'etiqueta',
  'entidadTipo', 'entidadId', 'campo', 'seccion', 'panelId'
];
const rowTypes = new Set([
  'metadato', 'riesgo', 'accion', 'control', 'relacion_control_riesgo',
  'objetivo', 'hito_gobernanza', 'escenario_simulacion', 'fuente',
  'fuente_panel'
]);
const requiredFields = {
  metadato: ['id', 'valor'],
  riesgo: ['id', 'causa', 'evento', 'consecuencia', 'activo', 'pInh', 'iInh', 'pRes', 'iRes'],
  accion: ['id', 'riesgoId', 'plazoDias'],
  control: ['id', 'categoria', 'incluido'],
  relacion_control_riesgo: ['id', 'riesgoId', 'numeroControl', 'justificacion'],
  objetivo: ['id', 'nombre', 'meta', 'unidad'],
  hito_gobernanza: ['id', 'nombre'],
  escenario_simulacion: ['id', 'nombre', 'riesgoId', 'variable', 'valorInicial', 'valorSimulado'],
  fuente: ['id', 'entidadTipo', 'entidadId', 'campo', 'seccion'],
  fuente_panel: ['id', 'panelId', 'seccion']
};
const numericFields = new Set([
  'pInh', 'iInh', 'pRes', 'iRes', 'plazoDias', 'meta', 'medicion',
  'valorInicial', 'valorSimulado'
]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('CSV inválido: campo entrecomillado sin cierre.');
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ''));
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }
  return rows;
}

function fail(rowNumber, fieldName, message) {
  throw new Error(`Fila ${rowNumber}, campo "${fieldName}": ${message}`);
}

function parseBoolean(value, rowNumber, fieldName) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  fail(rowNumber, fieldName, 'use true o false.');
}

function parseDate(value, rowNumber, fieldName, nullable) {
  if (nullable && (value === '' || value === 'null')) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(rowNumber, fieldName, 'use una fecha ISO con formato AAAA-MM-DD.');
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    fail(rowNumber, fieldName, 'la fecha ISO no existe.');
  }
  return value;
}

function convertValue(type, fieldName, raw, rowNumber) {
  if (raw === '') return null;
  if (type === 'metadato' && fieldName === 'valor') {
    if (raw === 'null' && fieldName === 'valor') return null;
    return raw;
  }
  if (fieldName === 'fecha') return parseDate(raw, rowNumber, fieldName, false);
  if (numericFields.has(fieldName)) {
    const value = Number(raw);
    if (!Number.isFinite(value)) fail(rowNumber, fieldName, 'se requiere un número válido.');
    return value;
  }
  if (fieldName === 'incluido') return parseBoolean(raw, rowNumber, fieldName);
  return raw;
}

function validateHeader(header) {
  const seen = new Set();
  for (const column of header) {
    if (seen.has(column)) throw new Error(`Encabezado CSV duplicado: "${column}".`);
    seen.add(column);
  }
  for (const column of columns) {
    if (!seen.has(column)) throw new Error(`Falta la columna requerida "${column}" en el encabezado CSV.`);
  }
}

function buildData(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error('El CSV está vacío y no contiene encabezado.');
  const header = rows[0].map((cell) => cell.trim());
  validateHeader(header);

  const data = {
    metadatos: {},
    riesgos: [],
    acciones: [],
    controles: [],
    relaciones: [],
    objetivos: [],
    hitos: [],
    escenarios: [],
    fuentes: [],
    fuentesPanel: []
  };
  const collectionByType = {
    riesgo: 'riesgos',
    accion: 'acciones',
    control: 'controles',
    relacion_control_riesgo: 'relaciones',
    objetivo: 'objetivos',
    hito_gobernanza: 'hitos',
    escenario_simulacion: 'escenarios',
    fuente: 'fuentes',
    fuente_panel: 'fuentesPanel'
  };
  const seenIds = new Set();

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const cells = rows[rowIndex];
    const rowNumber = rowIndex + 1;
    if (cells.length !== header.length) {
      fail(rowNumber, 'fila', `se esperaban ${header.length} columnas y se encontraron ${cells.length}.`);
    }
    const raw = Object.fromEntries(header.map((name, index) => [name, cells[index].trim()]));
    const type = raw.tipo;
    if (!rowTypes.has(type)) fail(rowNumber, 'tipo', `tipo desconocido "${type}".`);
    if (!raw.id) fail(rowNumber, 'id', 'el identificador no puede estar vacío.');
    const uniqueKey = `${type}:${raw.id}`;
    if (seenIds.has(uniqueKey)) fail(rowNumber, 'id', `identificador duplicado "${raw.id}" para el tipo "${type}".`);
    seenIds.add(uniqueKey);

    const record = {};
    for (const fieldName of header) {
      if (fieldName === 'tipo' || raw[fieldName] === '') continue;
      record[fieldName] = convertValue(type, fieldName, raw[fieldName], rowNumber);
    }
    if (type === 'metadato' && record.id === 'fechaRatificacion' && raw.valor === '') {
      record.valor = null;
    }
    for (const fieldName of requiredFields[type]) {
      const nullableRatification = type === 'metadato' && record.id === 'fechaRatificacion' && record.valor === null;
      if (record[fieldName] === undefined || (record[fieldName] === null && !nullableRatification) || record[fieldName] === '') {
        fail(rowNumber, fieldName, 'campo requerido ausente.');
      }
    }

    if (type === 'metadato') {
      if (Object.prototype.hasOwnProperty.call(data.metadatos, record.id)) {
        fail(rowNumber, 'id', `metadato duplicado "${record.id}".`);
      }
      data.metadatos[record.id] = record.valor;
    } else if (type === 'control') {
      data.controles.push({
        numero: record.id,
        categoria: record.categoria,
        incluido: record.incluido,
        condicion: record.condicion || null,
        justificacion: record.justificacion || null,
        estado: record.estado || null,
        metrica: record.metrica || null,
        evidencia: record.evidencia || null
      });
    } else {
      const target = collectionByType[type];
      delete record.tipo;
      data[target].push(record);
    }
  }

  validateData(data);
  return data;
}

function validateData(data) {
  const riskIds = data.riesgos.map((risk) => risk.id).sort();
  const expectedRiskIds = ['R-1', 'R-2', 'R-3', 'R-4', 'R-5', 'R-6'];
  if (riskIds.length !== expectedRiskIds.length || riskIds.some((id, index) => id !== expectedRiskIds[index])) {
    throw new Error('Se requieren exactamente los riesgos R-1 a R-6.');
  }
  if (data.acciones.length !== 6) throw new Error('Se requieren seis acciones, una por cada riesgo.');
  if (data.controles.length !== 93) throw new Error('Se requieren los 93 controles del Anexo A.');
  if (data.objetivos.length !== 5) throw new Error('Se requieren cinco objetivos.');
  if (data.hitos.length !== 5) throw new Error('Se requieren cinco hitos de gobernanza.');
  if (data.escenarios.length !== 4) throw new Error('Se requieren los cuatro escenarios de simulación.');
  const expectedCategories = { organizacional: 37, personas: 8, fisico: 14, tecnologico: 34 };
  const categoryCounts = data.controles.reduce((counts, control) => {
    const value = String(control.categoria).toLocaleLowerCase('es-PE');
    let category = value;
    if (value.includes('organiz')) category = 'organizacional';
    else if (value.includes('persona')) category = 'personas';
    else if (value.includes('fis') || value.includes('fís')) category = 'fisico';
    else if (value.includes('tecn')) category = 'tecnologico';
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  if (Object.entries(expectedCategories).some(([category, count]) => categoryCounts[category] !== count)) {
    throw new Error('Los controles no coinciden con la distribución oficial por categoría.');
  }
  if (data.controles.filter((control) => control.condicion).length !== 3) {
    throw new Error('Se requieren tres controles condicionados.');
  }
  const conditionedIds = new Set(data.controles.filter((control) => control.condicion).map((control) => String(control.numero)));
  for (const controlId of ['5.23', '7.9', '8.30']) {
    if (!conditionedIds.has(controlId)) throw new Error(`Falta el control condicionado ${controlId}.`);
  }
  const expectedDurations = new Map([
    ['R-1', 90], ['R-2', 120], ['R-3', 60], ['R-4', 60], ['R-5', 90], ['R-6', 45]
  ]);
  const actionsByRisk = new Map(data.acciones.map((action) => [action.riesgoId, action]));
  for (const [riskId, duration] of expectedDurations) {
    if (!actionsByRisk.has(riskId) || actionsByRisk.get(riskId).plazoDias !== duration) {
      throw new Error(`La acción ${riskId} debe tener un plazo de ${duration} días.`);
    }
  }
  const expectedScenarios = [
    ['Sin MFA', 'R-4', 'probabilidad', 2, 3],
    ['Sin WAF', 'R-2', 'probabilidad', 1, 4],
    ['Sin enlace secundario', 'R-5', 'probabilidad', 1, 3],
    ['Reducción de impacto con respaldos', 'R-1', 'impacto', 4, 2]
  ];
  for (const [name, riskId, variable, initialValue, simulatedValue] of expectedScenarios) {
    const scenario = data.escenarios.find((item) => item.nombre === name);
    if (!scenario || scenario.riesgoId !== riskId || scenario.variable !== variable ||
      scenario.valorInicial !== initialValue || scenario.valorSimulado !== simulatedValue) {
      throw new Error(`El escenario "${name}" no coincide con la especificación.`);
    }
    if (name === 'Reducción de impacto con respaldos' &&
      !String(scenario.etiqueta || '').toLocaleLowerCase('es-PE').includes('no oficial')) {
      throw new Error('La reducción del impacto debe identificarse como escenario no oficial.');
    }
  }
  for (const risk of data.riesgos) {
    for (const field of ['pInh', 'iInh', 'pRes', 'iRes']) {
      if (!Number.isInteger(risk[field]) || risk[field] < 1 || risk[field] > 5) {
        throw new Error(`Riesgo ${risk.id}: ${field} debe ser un entero entre 1 y 5.`);
      }
    }
  }
  const controls = new Set(data.controles.map((control) => control.numero));
  const risks = new Set(riskIds);
  for (const control of data.controles) {
    if (control.condicion && !controls.has(control.numero)) {
      throw new Error(`Control condicionado ${control.numero} no existe en el Anexo A.`);
    }
  }
  for (const action of data.acciones) {
    if (!risks.has(action.riesgoId)) throw new Error(`Acción ${action.id}: riesgo no existente "${action.riesgoId}".`);
  }
  for (const relation of data.relaciones) {
    if (!risks.has(relation.riesgoId)) throw new Error(`Relación ${relation.id}: riesgo no existente "${relation.riesgoId}".`);
    if (!controls.has(relation.numeroControl)) throw new Error(`Relación ${relation.id}: control no existente "${relation.numeroControl}".`);
  }
  for (const scenario of data.escenarios) {
    if (!risks.has(scenario.riesgoId)) throw new Error(`Escenario ${scenario.id}: riesgo no existente "${scenario.riesgoId}".`);
    if (!['probabilidad', 'impacto'].includes(scenario.variable)) {
      throw new Error(`Escenario ${scenario.id}: variable debe ser probabilidad o impacto.`);
    }
    for (const field of ['valorInicial', 'valorSimulado']) {
      if (!Number.isInteger(scenario[field]) || scenario[field] < 1 || scenario[field] > 5) {
        throw new Error(`Escenario ${scenario.id}: ${field} debe ser un entero entre 1 y 5.`);
      }
    }
  }
  if (!data.metadatos.fechaCorte) throw new Error('Falta el metadato fechaCorte.');
  data.metadatos.fechaCorte = parseDate(data.metadatos.fechaCorte, 'metadatos', 'fechaCorte', false);
  if (!Object.prototype.hasOwnProperty.call(data.metadatos, 'fechaRatificacion')) {
    throw new Error('Falta el metadato fechaRatificacion; use null si está pendiente.');
  }
  if (data.metadatos.fechaRatificacion !== null) {
    data.metadatos.fechaRatificacion = parseDate(data.metadatos.fechaRatificacion, 'metadatos', 'fechaRatificacion', false);
  }
}

function main() {
  const csv = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '');
  const data = buildData(csv);
  const output = `window.DATOS_SGSI = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`Datos del SGSI generados en ${path.relative(root, outputPath)}.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`No se generó datos.js: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { buildData, parseCsv, validateData };
