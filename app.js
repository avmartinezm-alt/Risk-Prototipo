(function () {
  'use strict';

  const riskIds = ['R-1', 'R-2', 'R-3', 'R-4', 'R-5', 'R-6'];
  const panelIds = ['resumen', 'riesgos', 'simulador', 'cronograma', 'controles', 'objetivos', 'gobernanza'];
  const categoryOrder = ['organizacional', 'personas', 'fisico', 'tecnologico'];
  const categoryLabels = {
    organizacional: 'Organizacionales',
    personas: 'De personas',
    fisico: 'Físicos',
    tecnologico: 'Tecnológicos'
  };
  const levelColors = {
    Bajo: '#218548',
    Medio: '#d39b00',
    Alto: '#e97824',
    Crítico: '#c83b32'
  };
  const elements = {
    alert: document.getElementById('data-alert'),
    panels: Array.from(document.querySelectorAll('[data-panel]')),
    navItems: Array.from(document.querySelectorAll('[data-panel-target]')),
    globalSearch: document.getElementById('global-search'),
    riskSearch: document.getElementById('risk-search'),
    controlSearch: document.getElementById('control-search'),
    sidebar: document.getElementById('sidebar'),
    presentationControls: document.getElementById('presentation-controls')
  };

  let data;
  let activeWindow = 'diagnostico';
  let activePanel = 'resumen';
  let expandedRiskId = '';
  let focusedRiskId = '';
  let simulatedValues = new Map();
  let summaryChart;
  let simulationChart;
  let presentationMode = false;

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function clear(node) {
    node.replaceChildren();
  }

  function showError(message) {
    elements.alert.textContent = message;
    elements.alert.hidden = false;
    elements.panels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove('is-active');
    });
  }

  function nivel(product) {
    if (!Number.isInteger(product) || product < 1 || product > 25) return null;
    if (product <= 5) return 'Bajo';
    if (product <= 12) return 'Medio';
    if (product <= 16) return 'Alto';
    return 'Crítico';
  }

  function ventanaActiva(risk) {
    if (!risk) {
      return activeWindow === 'diagnostico'
        ? { key: 'diagnostico', label: 'DIAGNÓSTICO (pre-implementación)', pField: 'pInh', iField: 'iInh' }
        : { key: 'post', label: 'POST-IMPLEMENTACIÓN', pField: 'pRes', iField: 'iRes' };
    }
    const windowInfo = ventanaActiva();
    return {
      p: risk[windowInfo.pField],
      i: risk[windowInfo.iField],
      label: windowInfo.label
    };
  }

  function validateData(candidate) {
    if (!candidate || typeof candidate !== 'object') {
      throw new Error('No se encontraron los datos del informe');
    }
    const collectionNames = ['riesgos', 'acciones', 'controles', 'relaciones', 'objetivos', 'hitos', 'escenarios', 'fuentes', 'fuentesPanel'];
    for (const name of collectionNames) {
      if (!Array.isArray(candidate[name])) throw new Error(`Falta la colección de datos "${name}".`);
    }
    if (!candidate.metadatos || typeof candidate.metadatos !== 'object') {
      throw new Error('Faltan los metadatos del informe.');
    }
    const actualIds = candidate.riesgos.map((risk) => risk.id).sort();
    const expectedIds = [...riskIds].sort();
    if (actualIds.length !== expectedIds.length || actualIds.some((id, index) => id !== expectedIds[index])) {
      throw new Error('Se requieren exactamente los seis riesgos R-1 a R-6.');
    }
    for (const risk of candidate.riesgos) {
      for (const field of ['pInh', 'iInh', 'pRes', 'iRes']) {
        if (!Number.isInteger(risk[field]) || risk[field] < 1 || risk[field] > 5) {
          throw new Error(`${risk.id}: ${field} debe ser un entero entre 1 y 5.`);
        }
      }
    }
    const controlIds = new Set(candidate.controles.map((control) => String(control.numero)));
    const riskSet = new Set(actualIds);
    const conditioned = candidate.controles.filter((control) => Boolean(control.condicion));
    const categoryCounts = candidate.controles.reduce((counts, control) => {
      const category = normalizeCategory(control.categoria);
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});
    const expectedCategoryCounts = { organizacional: 37, personas: 8, fisico: 14, tecnologico: 34 };
    if (candidate.controles.length !== 93 ||
      Object.entries(expectedCategoryCounts).some(([category, count]) => categoryCounts[category] !== count)) {
      throw new Error('El Anexo A debe contener 93 controles distribuidos en las categorías oficiales.');
    }
    if (candidate.acciones.length !== 6 || conditioned.length !== 3 ||
      candidate.objetivos.length !== 5 || candidate.hitos.length !== 5 || candidate.escenarios.length !== 4) {
      throw new Error('Las acciones, condiciones, objetivos, hitos o escenarios no coinciden con la especificación.');
    }
    const expectedDurations = new Map([
      ['R-1', 90], ['R-2', 120], ['R-3', 60], ['R-4', 60], ['R-5', 90], ['R-6', 45]
    ]);
    const actionsByRisk = new Map(candidate.acciones.map((action) => [action.riesgoId, action]));
    for (const [riskId, duration] of expectedDurations) {
      if (!actionsByRisk.has(riskId) || actionsByRisk.get(riskId).plazoDias !== duration) {
        throw new Error(`La acción ${riskId} debe tener un plazo de ${duration} días.`);
      }
    }
    for (const control of conditioned) {
      if (!controlIds.has(String(control.numero))) {
        throw new Error(`El control condicionado ${control.numero} no existe en el Anexo A.`);
      }
    }
    for (const relation of candidate.relaciones) {
      if (!riskSet.has(relation.riesgoId) || !controlIds.has(String(relation.numeroControl))) {
        throw new Error(`La relación ${relation.id} referencia un riesgo o control inexistente.`);
      }
    }
    if (candidate.metadatos.fechaCorte && !isIsoDate(candidate.metadatos.fechaCorte)) {
      throw new Error('fechaCorte debe ser una fecha ISO válida.');
    }
    if (candidate.metadatos.fechaRatificacion &&
      !isIsoDate(candidate.metadatos.fechaRatificacion)) {
      throw new Error('fechaRatificacion debe ser una fecha ISO válida o nula.');
    }
    return true;
  }

  function isIsoDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function localizedDate(isoDate) {
    if (!isoDate) return 'Pendiente';
    const date = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return 'Pendiente';
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function score(probability, impact) {
    return probability * impact;
  }

  function sourceFor(entityType, entityId, field) {
    return data.fuentes.find((source) =>
      source.entidadTipo === entityType &&
      String(source.entidadId) === String(entityId) &&
      source.campo === field
    );
  }

  function addSourceDisclosure(parent, source) {
    if (!source || !source.seccion) {
      parent.append(make('span', 'source-missing', 'Fuente no consignada'));
      return;
    }
    const details = make('details', 'source-disclosure');
    const summary = make('summary', 'source-button', 'Fuente');
    details.append(summary, make('span', '', `Sección ${source.seccion}`));
    parent.append(details);
  }

  function riskLevelBadge(value) {
    const label = nivel(value);
    const badge = make('span', `level-badge level-${label ? label.toLocaleLowerCase('es-PE') : 'sin-dato'}`, label || 'Sin medición');
    return badge;
  }

  function createRing(value, maximum, color, label, displayValue) {
    const circumference = 2 * Math.PI * 39;
    const ratio = maximum > 0 && Number.isFinite(value) ? Math.min(1, Math.max(0, value / maximum)) : 0;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'ring-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('cx', '50');
    track.setAttribute('cy', '50');
    track.setAttribute('r', '39');
    track.setAttribute('class', 'ring-track');
    const progress = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progress.setAttribute('cx', '50');
    progress.setAttribute('cy', '50');
    progress.setAttribute('r', '39');
    progress.setAttribute('class', 'ring-progress');
    progress.setAttribute('stroke', color);
    progress.setAttribute('stroke-dasharray', `${circumference * ratio} ${circumference}`);
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', '50');
    valueText.setAttribute('y', '51');
    valueText.setAttribute('class', 'ring-number');
    valueText.textContent = displayValue === undefined ? String(value) : String(displayValue);
    svg.append(track, progress, valueText);
    return svg;
  }

  function ringCard(value, maximum, color, title, caption, displayValue) {
    const card = make('article', 'card ring-card');
    card.append(createRing(value, maximum, color, title, displayValue));
    const description = make('div', 'ring-caption');
    description.append(make('strong', '', title), make('span', '', caption));
    card.append(description);
    return card;
  }

  function allWindows(risk) {
    const inherent = { p: risk.pInh, i: risk.iInh, total: score(risk.pInh, risk.iInh) };
    const residual = { p: risk.pRes, i: risk.iRes, total: score(risk.pRes, risk.iRes) };
    inherent.level = nivel(inherent.total);
    residual.level = nivel(residual.total);
    return { inherent, residual };
  }

  function drawSummary() {
    const rings = document.getElementById('summary-rings');
    clear(rings);
    const mitigated = data.riesgos.filter((risk) => {
      const windows = allWindows(risk);
      return ['Alto', 'Crítico'].includes(windows.inherent.level) && windows.residual.level === 'Bajo';
    }).length;
    const conditionedCount = data.controles.filter((control) => Boolean(control.condicion)).length;
    const objectiveCount = data.objetivos.filter(objectiveIsMet).length;
    rings.append(
      ringCard(mitigated, data.riesgos.length, '#3bb5b0', 'Riesgos mitigados', 'De Alto o Crítico a Bajo'),
      ringCard(conditionedCount, conditionedCount, '#1e9bff', 'Controles condicionados', `De ${conditionedCount} controles condicionados`),
      ringCard(objectiveCount, data.objetivos.length, '#9b59b6', 'Objetivos en meta', `De ${data.objetivos.length} objetivos`)
    );
    document.getElementById('summary-totals').textContent =
      `${data.riesgos.length} riesgos · ${data.controles.length} controles · ${data.acciones.length} acciones`;

    const legend = document.getElementById('summary-legend');
    clear(legend);
    [
      ['Inherente', '#3bb5b0'],
      ['Residual', '#1e9bff']
    ].forEach(([label, color]) => {
      const item = make('span', 'legend-item');
      const swatch = make('span', 'legend-swatch');
      swatch.style.backgroundColor = color;
      item.append(swatch, make('span', '', label));
      legend.append(item);
    });
    renderSummaryChart();
  }

  function chartUnavailable(canvas, message) {
    const parent = canvas.parentElement;
    if (!parent) return;
    parent.querySelectorAll('.chart-fallback').forEach((node) => node.remove());
    parent.append(make('p', 'empty-state chart-fallback', message));
  }

  function renderSummaryChart() {
    const canvas = document.getElementById('summary-chart');
    if (summaryChart) summaryChart.destroy();
    if (typeof window.Chart !== 'function') {
      chartUnavailable(canvas, 'Gráfico no disponible: no se pudo cargar Chart.js.');
      return;
    }
    const inherent = data.riesgos.map((risk) => ({
      value: score(risk.pInh, risk.iInh),
      p: risk.pInh,
      i: risk.iInh
    }));
    const residual = data.riesgos.map((risk) => ({
      value: score(risk.pRes, risk.iRes),
      p: risk.pRes,
      i: risk.iRes
    }));
    summaryChart = new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.riesgos.map((risk) => risk.id),
        datasets: [
          { label: 'Inherente', data: inherent.map((item) => item.value), backgroundColor: '#3bb5b0', borderRadius: 5, riskValues: inherent },
          { label: 'Residual', data: residual.map((item) => item.value), backgroundColor: '#1e9bff', borderRadius: 5, riskValues: residual }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const item = context.dataset.riskValues[context.dataIndex];
                return `${context.dataset.label}: P ${item.p} × I ${item.i} = ${item.value} (${nivel(item.value)})`;
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, suggestedMax: 25, title: { display: true, text: 'P × I' } },
          x: { grid: { display: false } }
        },
        onClick(_event, activeElements) {
          if (!activeElements.length) return;
          focusedRiskId = data.riesgos[activeElements[0].index].id;
          expandedRiskId = focusedRiskId;
          showPanel('riesgos');
          renderRisks();
        }
      }
    });
  }

  function objectiveIsMet(objective) {
    if (!hasMeasurement(objective)) return false;
    return Number(objective.medicion) >= Number(objective.meta);
  }

  function hasMeasurement(objective) {
    return objective.medicion !== null &&
      objective.medicion !== undefined &&
      objective.medicion !== '' &&
      Number.isFinite(Number(objective.medicion));
  }

  function renderRiskDetails(risk) {
    const row = make('tr', 'risk-detail-row');
    const cell = make('td');
    cell.colSpan = 6;
    const grid = make('div', 'risk-detail-grid');
    const windows = allWindows(risk);
    const scoreCard = make('section', 'detail-item');
    scoreCard.append(make('h5', '', 'Valores oficiales'));
    [
      ['Inherente', windows.inherent, 'pInh', 'iInh'],
      ['Residual', windows.residual, 'pRes', 'iRes']
    ].forEach(([label, item, probabilityField, impactField]) => {
      const line = make('p');
      line.append(document.createTextNode(`${label}: P ${item.p} `));
      addSourceDisclosure(line, sourceFor('riesgo', risk.id, probabilityField));
      line.append(document.createTextNode(` × I ${item.i} `));
      addSourceDisclosure(line, sourceFor('riesgo', risk.id, impactField));
      line.append(document.createTextNode(` = ${item.total} · `));
      line.append(riskLevelBadge(item.total));
      scoreCard.append(line);
    });
    const related = data.relaciones.filter((relation) => relation.riesgoId === risk.id);
    const controlCard = make('section', 'detail-item');
    controlCard.append(make('h5', '', 'Controles asociados (Anexo A)'));
    if (related.length) {
      related.forEach((relation) => {
        const control = data.controles.find((item) => String(item.numero) === String(relation.numeroControl));
        const line = make('p', '', `${relation.numeroControl} · ${control ? control.justificacion || control.categoria : 'Control'} — ${relation.justificacion}`);
        addSourceDisclosure(line, sourceFor('relacion_control_riesgo', relation.id, 'justificacion'));
        controlCard.append(line);
      });
    } else {
      controlCard.append(make('p', '', 'Pendiente'));
    }
    const action = data.acciones.find((item) => item.riesgoId === risk.id);
    const actionCard = make('section', 'detail-item');
    actionCard.append(make('h5', '', 'Tratamiento'));
    actionCard.append(make('p', '', `Responsable: ${action && action.responsable ? action.responsable : 'Pendiente'}`));
    const deadline = make('p');
    deadline.append(document.createTextNode(`Plazo: ${action && action.plazoDias !== undefined ? `${action.plazoDias} días` : 'Pendiente'} `));
    if (action) addSourceDisclosure(deadline, sourceFor('accion', action.id, 'plazoDias'));
    actionCard.append(deadline);
    const sources = make('section', 'detail-item');
    sources.append(make('h5', '', 'Trazabilidad'));
    const availableSources = data.fuentes.filter((source) => source.entidadTipo === 'riesgo' && String(source.entidadId) === risk.id);
    if (availableSources.length) {
      availableSources.forEach((source) => sources.append(make('p', '', `${source.campo}: sección ${source.seccion}`)));
    } else {
      sources.append(make('p', '', 'Fuente no consignada en los datos.'));
    }
    grid.append(scoreCard, controlCard, actionCard, sources);
    cell.append(grid);
    row.append(cell);
    return row;
  }

  function renderRisks() {
    const body = document.getElementById('risk-table-body');
    clear(body);
    const query = (elements.riskSearch.value || '').trim().toLocaleLowerCase('es-PE');
    const filtered = data.riesgos.filter((risk) => {
      const text = [risk.id, risk.causa, risk.evento, risk.consecuencia, risk.activo].join(' ').toLocaleLowerCase('es-PE');
      return text.includes(query);
    });
    if (!filtered.length) {
      const row = make('tr');
      const cell = make('td', 'empty-state', 'No se encontraron riesgos.');
      cell.colSpan = 6;
      row.append(cell);
      body.append(row);
      return;
    }
    filtered.forEach((risk) => {
      const values = ventanaActiva(risk);
      const riskRow = make('tr', focusedRiskId === risk.id ? 'is-focused' : '');
      riskRow.tabIndex = 0;
      riskRow.setAttribute('aria-expanded', String(expandedRiskId === risk.id));
      const toggleRiskDetails = () => {
        expandedRiskId = expandedRiskId === risk.id ? '' : risk.id;
        renderRisks();
      };
      riskRow.addEventListener('click', (event) => {
        if (event.target.closest('button, a, summary')) return;
        toggleRiskDetails();
      });
      riskRow.addEventListener('keydown', (event) => {
        if (event.target !== riskRow || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        toggleRiskDetails();
      });
      const idCell = make('td');
      const toggle = make('button', 'risk-id-button', risk.id);
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', String(expandedRiskId === risk.id));
      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleRiskDetails();
      });
      idCell.append(toggle);
      riskRow.append(idCell);
      [risk.causa, risk.evento, risk.consecuencia, risk.activo].forEach((value) => riskRow.append(make('td', '', value || 'Pendiente')));
      const levelCell = make('td');
      levelCell.append(riskLevelBadge(score(values.p, values.i)));
      levelCell.append(make('span', 'visually-hidden', ` ${values.label}`));
      riskRow.append(levelCell);
      body.append(riskRow);
      if (expandedRiskId === risk.id) body.append(renderRiskDetails(risk));
    });
  }

  function renderHeatLegend() {
    const legend = document.getElementById('heat-legend');
    clear(legend);
    Object.entries(levelColors).forEach(([label, color]) => {
      const item = make('span', 'legend-item');
      const swatch = make('span', 'legend-swatch');
      swatch.style.backgroundColor = color;
      item.append(swatch, make('span', '', label));
      legend.append(item);
    });
  }

  function simulatedValue(risk) {
    const current = simulatedValues.get(risk.id);
    if (current) return current;
    const active = ventanaActiva(risk);
    return { p: active.p, i: active.i };
  }

  function renderHeatMap() {
    const map = document.getElementById('heat-map');
    clear(map);
    const windowInfo = ventanaActiva();
    const activePoints = [];
    for (let probability = 5; probability >= 1; probability -= 1) {
      for (let impact = 1; impact <= 5; impact += 1) {
        const cell = make('div', `heat-cell ${heatClass(score(probability, impact))}`);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Probabilidad ${probability}, impacto ${impact}, ${nivel(score(probability, impact))}`);
        cell.append(make('span', 'heat-cell-label', `${probability}×${impact}`));
        data.riesgos.forEach((risk) => {
          if (windowInfo.key === 'post') {
            if (risk.pInh === probability && risk.iInh === impact) {
              const marker = make('span', 'heat-marker is-inherent', `${risk.id} I`);
              marker.title = `${risk.id}, inherente: P ${risk.pInh}, I ${risk.iInh}`;
              cell.append(marker);
            }
            if (risk.pRes === probability && risk.iRes === impact) {
              const marker = make('span', 'heat-marker', `${risk.id} R`);
              marker.title = `${risk.id}, residual: P ${risk.pRes}, I ${risk.iRes}`;
              cell.append(marker);
            }
          } else {
            const current = simulatedValue(risk);
            if (risk.pInh === probability && risk.iInh === impact) {
              const marker = make('span', 'heat-marker is-inherent', risk.id);
              marker.title = `${risk.id}, diagnóstico: P ${risk.pInh}, I ${risk.iInh}`;
              cell.append(marker);
            }
            if (current.p === probability && current.i === impact &&
              (current.p !== risk.pInh || current.i !== risk.iInh)) {
              cell.append(make('span', 'heat-marker is-simulated', `${risk.id} S`));
            }
          }
          const current = simulatedValue(risk);
          if (windowInfo.key === 'post' &&
            (current.p !== risk.pRes || current.i !== risk.iRes) &&
            current.p === probability && current.i === impact) {
            cell.append(make('span', 'heat-marker is-simulated', `${risk.id} S`));
          }
        });
        map.append(cell);
      }
    }
    map.append(make('div', 'axis-label', 'Probabilidad ↑ · Impacto →'));
    renderHeatLegend();
    const label = document.getElementById('sim-window-label');
    label.textContent = windowInfo.label;
    renderSimulationChart();
  }

  function heatClass(product) {
    const level = nivel(product);
    if (level === 'Crítico') return 'heat-critical';
    return `heat-${level ? level.toLocaleLowerCase('es-PE') : 'low'}`;
  }

  function renderSimulatorControls() {
    const container = document.getElementById('simulator-controls');
    clear(container);
    container.className = 'sim-risk-controls';
    data.riesgos.forEach((risk) => {
      const values = simulatedValue(risk);
      const card = make('section', 'sim-risk-card');
      card.append(make('h5', '', risk.id));
      [['p', 'Probabilidad'], ['i', 'Impacto']].forEach(([field, label]) => {
        const row = make('div', 'sim-slider-row');
        const inputId = `sim-${risk.id}-${field}`;
        const labelNode = make('label', '', label);
        labelNode.htmlFor = inputId;
        const input = document.createElement('input');
        input.type = 'range';
        input.id = inputId;
        input.min = '1';
        input.max = '5';
        input.step = '1';
        input.value = String(values[field]);
        input.setAttribute('aria-label', `${risk.id}: ${label}`);
        const output = make('output', '', values[field]);
        input.addEventListener('input', () => {
          const updated = { ...simulatedValue(risk), [field]: Number(input.value) };
          simulatedValues.set(risk.id, updated);
          output.value = input.value;
          output.textContent = input.value;
          updateSimulationResult(card, risk, updated);
          renderHeatMap();
        });
        row.append(labelNode, input, output);
        card.append(row);
      });
      updateSimulationResult(card, risk, values);
      container.append(card);
    });
  }

  function updateSimulationResult(card, risk, simulated) {
    let result = card.querySelector('.sim-result');
    if (!result) {
      result = make('p', 'sim-result');
      card.append(result);
    }
    const official = ventanaActiva(risk);
    const officialTotal = score(official.p, official.i);
    const simulatedTotal = score(simulated.p, simulated.i);
    result.textContent = `Oficial: ${officialTotal} (${nivel(officialTotal)}) → Simulado: ${simulatedTotal} (${nivel(simulatedTotal)})`;
  }

  function renderSimulationChart() {
    const canvas = document.getElementById('simulation-chart');
    if (simulationChart) simulationChart.destroy();
    if (typeof window.Chart !== 'function') {
      chartUnavailable(canvas, 'Gráfico no disponible: no se pudo cargar Chart.js.');
      return;
    }
    const official = data.riesgos.map((risk) => {
      const values = ventanaActiva(risk);
      return score(values.p, values.i);
    });
    const simulated = data.riesgos.map((risk) => {
      const values = simulatedValue(risk);
      return score(values.p, values.i);
    });
    simulationChart = new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.riesgos.map((risk) => risk.id),
        datasets: [
          { label: 'Oficial', data: official, backgroundColor: '#3bb5b0', borderRadius: 4 },
          { label: 'Simulado', data: simulated, backgroundColor: '#9b59b6', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label}: ${context.raw} (${nivel(context.raw)})`;
              }
            }
          }
        },
        scales: { y: { beginAtZero: true, suggestedMax: 25 } }
      }
    });
  }

  function renderSimulator() {
    renderSimulatorControls();
    renderHeatMap();
  }

  function resetSimulator() {
    simulatedValues.clear();
    renderSimulator();
  }

  function applyScenario(scenario) {
    const risk = data.riesgos.find((item) => item.id === scenario.riesgoId);
    if (!risk) return;
    simulatedValues.clear();
    const values = { ...simulatedValue(risk) };
    const key = scenario.variable === 'probabilidad' ? 'p' : 'i';
    values[key] = Number(scenario.valorSimulado);
    simulatedValues.set(risk.id, values);
    renderSimulatorControls();
    renderHeatMap();
    if (scenario.etiqueta) {
      const notice = document.getElementById('window-reset-note');
      notice.textContent = scenario.etiqueta;
    }
  }

  function renderScenarios() {
    const list = document.getElementById('scenario-list');
    clear(list);
    data.escenarios.forEach((scenario) => {
      const button = make('button', 'scenario-button', scenario.nombre);
      button.type = 'button';
      const fieldLabel = scenario.variable === 'probabilidad' ? 'Probabilidad' : 'Impacto';
      button.title = `${fieldLabel}: ${scenario.valorInicial} → ${scenario.valorSimulado}`;
      button.addEventListener('click', () => applyScenario(scenario));
      list.append(button);
    });
  }

  function renderSchedule() {
    const container = document.getElementById('schedule-rows');
    const filter = document.getElementById('schedule-filter');
    const selected = filter.value;
    clear(container);
    const actions = data.acciones;
    const maxDuration = Math.max(1, ...actions.map((action) => Number(action.plazoDias) || 0));
    const riskById = new Map(data.riesgos.map((risk) => [risk.id, risk]));
    const cutoff = data.metadatos.fechaCorte;
    const ratification = data.metadatos.fechaRatificacion;
    const cutoffOffset = ratification && cutoff
      ? (new Date(`${cutoff}T00:00:00Z`).getTime() - new Date(`${ratification}T00:00:00Z`).getTime()) / 86400000
      : null;
    const markerPosition = cutoffOffset === null ? null : Math.max(0, Math.min(100, (cutoffOffset / maxDuration) * 100));
    let hasTodayLabel = false;
    actions.filter((action) => !selected || action.riesgoId === selected).forEach((action) => {
      const risk = riskById.get(action.riesgoId);
      const row = make('div', 'schedule-row');
      const label = make('div', 'schedule-label');
      label.append(make('strong', '', action.riesgoId));
      label.append(make('span', '', risk ? risk.evento : 'Acción de tratamiento'));
      const track = make('div', 'schedule-track');
      const bar = make('div', `schedule-bar ${statusClass(action.estado)}`);
      const duration = Number(action.plazoDias) || 0;
      bar.style.width = `${(duration / maxDuration) * 100}%`;
      bar.append(make('span', 'bar-label', `${duration} días`));
      const details = [
        `Responsable: ${action.responsable || 'Pendiente'}`,
        `KRI: ${action.kri || 'Pendiente'}`,
        `Evidencia: ${action.evidencia || 'Pendiente'}`,
        `Plazo: ${duration} días`
      ];
      if (ratification) {
        const start = new Date(`${ratification}T00:00:00Z`);
        const end = new Date(start.getTime() + duration * 86400000);
        details.push(`Inicio: ${localizedDate(start.toISOString().slice(0, 10))}`);
        details.push(`Fin: ${localizedDate(end.toISOString().slice(0, 10))}`);
      }
      bar.title = details.join(' · ');
      track.append(bar);
      if (markerPosition !== null) {
        const marker = make('span', 'today-marker');
        marker.style.left = `${markerPosition}%`;
        if (!hasTodayLabel) {
          marker.append(make('span', '', 'Hoy'));
          hasTodayLabel = true;
        }
        track.append(marker);
      }
      const status = make('span', 'governance-status', action.estado || 'Pendiente');
      row.append(label, track, status);
      container.append(row);
    });
    if (!container.childElementCount) container.append(make('p', 'empty-state', 'No hay acciones para el filtro seleccionado.'));
    const scale = document.getElementById('schedule-scale');
    clear(scale);
    scale.append(make('span', '', '0 días'), make('span', '', `${maxDuration} días`));
    const sources = data.fuentesPanel.filter((source) => source.panelId === 'cronograma').map((source) => source.seccion);
    document.getElementById('schedule-source').textContent = sources.length
      ? `Fuente: ${[...new Set(sources)].join(', ')}`
      : 'Fuente: secciones no consignadas en los datos.';
  }

  function statusClass(status) {
    const normalized = String(status || '').toLocaleLowerCase('es-PE');
    if (normalized === 'planificado') return 'status-planificado';
    if (normalized === 'en implementación') return 'status-en-implementación';
    if (normalized === 'implementado') return 'status-implementado';
    return '';
  }

  function renderControls() {
    const categories = document.getElementById('control-categories');
    clear(categories);
    categoryOrder.forEach((category) => {
      const controls = data.controles.filter((control) => normalizeCategory(control.categoria) === category);
      const withState = controls.filter((control) => Boolean(control.estado));
      const implemented = withState.filter((control) => ['implementado', 'implementada'].includes(String(control.estado).toLocaleLowerCase('es-PE'))).length;
      const percent = withState.length ? (implemented / withState.length) * 100 : 0;
      const card = make('article', 'card category-card');
      card.append(make('h4', '', categoryLabels[category]));
      card.append(make('div', 'category-total', String(controls.length)));
      card.append(make('p', '', `Controles · ${withState.length ? `${implemented} con estado implementado de ${withState.length}` : 'Sin medición'}`));
      const track = make('div', 'progress-track');
      const fill = make('div', 'progress-fill');
      fill.style.width = `${percent}%`;
      track.append(fill);
      card.append(track);
      categories.append(card);
    });

    const conditioned = document.getElementById('conditional-controls');
    clear(conditioned);
    const conditionalControls = data.controles.filter((control) => control.condicion);
    if (!conditionalControls.length) conditioned.append(make('p', 'empty-state', 'Sin controles condicionados registrados.'));
    conditionalControls.forEach((control) => {
      const item = make('div', 'conditional-item');
      item.append(make('strong', '', `${control.numero} · ${control.categoria}`));
      item.append(make('p', '', `Condición: ${control.condicion}`));
      item.append(make('p', '', `Evidencia requerida: ${control.evidencia || 'Pendiente'}`));
      conditioned.append(item);
    });
    renderControlMatrix();
    renderControlSearch();
  }

  function normalizeCategory(category) {
    const value = String(category || '').toLocaleLowerCase('es-PE');
    if (value.includes('organiz')) return 'organizacional';
    if (value.includes('persona')) return 'personas';
    if (value.includes('fis') || value.includes('fís')) return 'fisico';
    if (value.includes('tecn')) return 'tecnologico';
    return value;
  }

  function renderControlMatrix() {
    const container = document.getElementById('control-matrix');
    clear(container);
    const grid = make('div', 'control-matrix');
    const header = make('div', 'matrix-row');
    header.append(make('div', 'matrix-cell header', 'Riesgo'));
    categoryOrder.forEach((category) => header.append(make('div', 'matrix-cell header', categoryLabels[category])));
    grid.append(header);
    data.riesgos.forEach((risk) => {
      const row = make('div', 'matrix-row');
      row.append(make('div', 'matrix-cell header', risk.id));
      categoryOrder.forEach((category) => {
        const relations = data.relaciones.filter((relation) => {
          const control = data.controles.find((item) => String(item.numero) === String(relation.numeroControl));
          return relation.riesgoId === risk.id && control && normalizeCategory(control.categoria) === category;
        });
        const button = make('button', `matrix-cell ${relations.length ? 'is-marked' : ''}`, relations.length ? String(relations.length) : 'Sin relación');
        button.type = 'button';
        button.setAttribute('aria-label', `${risk.id}, ${categoryLabels[category]}: ${relations.length} relaciones`);
        button.addEventListener('click', () => {
          const detail = document.getElementById('matrix-detail');
          clear(detail);
          if (!relations.length) {
            detail.textContent = `${risk.id} · ${categoryLabels[category]}: sin relación consignada en los datos.`;
            return;
          }
          relations.forEach((relation) => {
            const control = data.controles.find((item) => String(item.numero) === String(relation.numeroControl));
            detail.append(make('p', '', `${risk.id} · Control ${relation.numeroControl} · ${control ? control.justificacion || control.categoria : ''} · ${relation.justificacion}`));
          });
        });
        row.append(button);
      });
      grid.append(row);
    });
    container.append(grid);
  }

  function renderControlSearch() {
    const results = document.getElementById('control-search-results');
    clear(results);
    const query = (elements.controlSearch.value || '').trim().toLocaleLowerCase('es-PE');
    if (!query) {
      results.append(make('p', 'empty-state', 'Busca un número o texto para consultar el control.'));
      return;
    }
    const matches = data.controles.filter((control) =>
      [control.numero, control.categoria, control.justificacion, control.metrica, control.evidencia, control.condicion]
        .join(' ')
        .toLocaleLowerCase('es-PE')
        .includes(query)
    );
    if (!matches.length) {
      results.append(make('p', 'empty-state', 'No se encontraron controles.'));
      return;
    }
    matches.forEach((control) => {
      const item = make('article', 'control-result');
      item.append(make('strong', '', `${control.numero} · ${control.categoria}`));
      item.append(make('p', '', `Justificación: ${control.justificacion || 'Pendiente'}`));
      item.append(make('p', '', `Métrica: ${control.metrica || 'Sin medición'}`));
      item.append(make('p', '', `Evidencia: ${control.evidencia || 'Pendiente'}`));
      results.append(item);
    });
  }

  function objectiveStatus(objective) {
    if (!hasMeasurement(objective)) {
      return { label: 'Sin medición', className: 'status-gris', color: '#8995a5' };
    }
    const deficit = Number(objective.meta) - Number(objective.medicion);
    if (deficit <= 0) return { label: 'En meta', className: 'status-verde', color: '#2ecc71' };
    if (deficit < 10) return { label: 'Cerca de la meta', className: 'status-amarillo', color: '#f5a623' };
    return { label: 'Fuera de meta', className: 'status-rojo', color: '#e74c3c' };
  }

  function renderObjectives() {
    const grid = document.getElementById('objective-grid');
    clear(grid);
    data.objetivos.forEach((objective) => {
      const status = objectiveStatus(objective);
      const measuredExists = hasMeasurement(objective);
      const measured = measuredExists ? Number(objective.medicion) : 0;
      const card = make('article', 'card objective-card');
      card.append(createRing(measured, Number(objective.meta) || 1, status.color, objective.nombre, measuredExists ? `${measured}${objective.unidad || ''}` : '—'));
      const description = make('div', 'ring-caption');
      description.append(make('strong', '', objective.nombre));
      description.append(make('span', '', `Meta: ${objective.meta}${objective.unidad || ''}`));
      description.append(make('span', '', `Medición: ${measuredExists ? `${measured}${objective.unidad || ''}` : 'Sin medición'}`));
      description.append(make('span', `objective-status ${status.className}`, status.label));
      card.append(description);
      grid.append(card);
    });
  }

  function renderGovernance() {
    const container = document.getElementById('governance-list');
    clear(container);
    let hasPending = false;
    data.hitos.forEach((milestone) => {
      const completed = String(milestone.estado || '').toLocaleLowerCase('es-PE') === 'completado';
      if (!completed) hasPending = true;
      const row = make('div', 'governance-item');
      row.append(make('span', '', milestone.nombre));
      const state = make('span', `governance-status ${completed ? 'is-done' : 'is-pending'}`, completed ? 'Completado' : 'Pendiente');
      row.append(state);
      if (milestone.fecha) row.append(make('span', '', localizedDate(milestone.fecha)));
      container.append(row);
    });
    const ratification = data.metadatos.fechaRatificacion;
    if (!ratification) hasPending = true;
    document.getElementById('ratification-date').textContent = ratification ? localizedDate(ratification) : 'Pendiente';
    document.querySelectorAll('[data-draft-pill], [data-governance-status]').forEach((pill) => {
      pill.textContent = hasPending ? 'BORRADOR' : 'COMPLETADO';
      pill.classList.toggle('is-complete', !hasPending);
    });
    const sources = data.fuentesPanel.filter((source) => source.panelId === 'gobernanza').map((source) => source.seccion);
    document.getElementById('governance-source').textContent = sources.length
      ? `Fuente: ${[...new Set(sources)].join(', ')}`
      : 'Fuente: secciones no consignadas en los datos.';
  }

  function renderScheduleFilter() {
    const select = document.getElementById('schedule-filter');
    clear(select);
    const allOption = make('option', '', 'Todos los riesgos');
    allOption.value = '';
    select.append(allOption);
    data.riesgos.forEach((risk) => {
      const option = make('option', '', risk.id);
      option.value = risk.id;
      select.append(option);
    });
  }

  function renderAll() {
    drawSummary();
    renderRisks();
    renderScenarios();
    renderSimulator();
    renderScheduleFilter();
    renderSchedule();
    renderControls();
    renderObjectives();
    renderGovernance();
    setText('[data-cutoff]', localizedDate(data.metadatos.fechaCorte));
    document.getElementById('active-window-label').textContent = ventanaActiva().label;
    elements.alert.hidden = true;
  }

  function showPanel(panelId) {
    if (!panelIds.includes(panelId)) return;
    activePanel = panelId;
    elements.panels.forEach((panel) => {
      const active = panel.dataset.panel === panelId;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    elements.navItems.forEach((button) => {
      const active = button.dataset.panelTarget === panelId;
      button.classList.toggle('is-active', active);
      if (button.getAttribute('role') === 'tab') button.setAttribute('aria-selected', String(active));
    });
    updatePresentationPosition();
  }

  function changeWindow(value) {
    if (value !== 'diagnostico' && value !== 'post') return;
    if (value === activeWindow) return;
    activeWindow = value;
    simulatedValues.clear();
    document.getElementById('active-window-label').textContent = ventanaActiva().label;
    document.getElementById('window-reset-note').textContent = 'Cambiar de ventana restablece el simulador';
    renderRisks();
    renderSimulator();
  }

  function searchGlobally(query) {
    const value = query.trim();
    if (!value) return;
    const normalized = value.toLocaleLowerCase('es-PE');
    const riskMatch = data.riesgos.some((risk) =>
      [risk.id, risk.causa, risk.evento, risk.consecuencia, risk.activo].join(' ').toLocaleLowerCase('es-PE').includes(normalized)
    );
    const controlMatch = data.controles.some((control) =>
      [control.numero, control.categoria, control.justificacion, control.metrica, control.evidencia].join(' ').toLocaleLowerCase('es-PE').includes(normalized)
    );
    if (riskMatch) {
      elements.riskSearch.value = value;
      showPanel('riesgos');
      renderRisks();
    } else if (controlMatch) {
      elements.controlSearch.value = value;
      showPanel('controles');
      renderControlSearch();
    } else {
      showPanel('riesgos');
      elements.riskSearch.value = value;
      renderRisks();
    }
  }

  function updatePresentationPosition() {
    if (!presentationMode) return;
    const index = panelIds.indexOf(activePanel);
    document.getElementById('presentation-position').textContent = `${index + 1} / ${panelIds.length}`;
  }

  function setPresentation(enabled) {
    presentationMode = enabled;
    document.body.classList.toggle('presentation-mode', enabled);
    elements.presentationControls.hidden = !enabled;
    if (enabled) showPanel(activePanel);
  }

  function movePresentation(direction) {
    const index = panelIds.indexOf(activePanel);
    const next = Math.max(0, Math.min(panelIds.length - 1, index + direction));
    showPanel(panelIds[next]);
  }

  function bindEvents() {
    elements.navItems.forEach((button) => {
      button.addEventListener('click', () => {
        showPanel(button.dataset.panelTarget);
        elements.sidebar.classList.remove('is-open');
      });
    });
    document.querySelectorAll('input[name="window"]').forEach((input) => {
      input.addEventListener('change', () => changeWindow(input.value));
    });
    elements.riskSearch.addEventListener('input', renderRisks);
    elements.controlSearch.addEventListener('input', renderControlSearch);
    elements.globalSearch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') searchGlobally(elements.globalSearch.value);
    });
    document.getElementById('schedule-filter').addEventListener('change', renderSchedule);
    document.getElementById('reset-simulator').addEventListener('click', () => {
      document.getElementById('window-reset-note').textContent = 'Valores oficiales de la ventana activa restablecidos.';
      resetSimulator();
    });
    document.getElementById('presentation-toggle').addEventListener('click', () => setPresentation(true));
    document.getElementById('presentation-exit').addEventListener('click', () => setPresentation(false));
    document.getElementById('presentation-prev').addEventListener('click', () => movePresentation(-1));
    document.getElementById('presentation-next').addEventListener('click', () => movePresentation(1));
    document.getElementById('mobile-menu').addEventListener('click', () => elements.sidebar.classList.add('is-open'));
    document.getElementById('sidebar-close').addEventListener('click', () => elements.sidebar.classList.remove('is-open'));
    document.getElementById('sidebar-collapse').addEventListener('click', (event) => {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      event.currentTarget.setAttribute('aria-pressed', String(collapsed));
      event.currentTarget.textContent = collapsed ? 'Expandir menú' : 'Contraer menú';
    });
    document.addEventListener('keydown', (event) => {
      if (!presentationMode) return;
      if (event.key === 'Escape') setPresentation(false);
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') movePresentation(1);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') movePresentation(-1);
    });
  }

  function boot() {
    if (!window.DATOS_SGSI) {
      showError('No se encontraron los datos del informe');
      return;
    }
    try {
      data = window.DATOS_SGSI;
      validateData(data);
    } catch (error) {
      showError(`Error de validación: ${error.message}`);
      return;
    }
    bindEvents();
    renderAll();
    showPanel('resumen');
  }

  window.SGSI_DASHBOARD = Object.freeze({ nivel, ventanaActiva, validarDatos: validateData });
  boot();
})();
