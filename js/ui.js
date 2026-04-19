import { CONFIG, MAP_TEMPLATES } from './config.js';
import { fmt } from './utils.js';
import { topProblemIntersections } from './intersections.js';
import { overloadedServices } from './services.js';
import { districtConnectivity } from './traffic.js';

export class UI {
  constructor(game) { this.game = game; this.bindControls(); }

  bindControls() {
    const { state, onNewMap } = this.game;
    this.bindButtonGroup('#toolGroup button', (btn) => state.ui.tool = btn.dataset.tool, 'road');
    this.bindButtonGroup('#layerGroup button', (btn) => state.ui.layerView = btn.dataset.layerView, 'combined');
    this.bindButtonGroup('#timeGroup [data-speed]', (btn) => state.sim.speed = +btn.dataset.speed, '1');

    document.getElementById('pauseBtn').onclick = () => state.sim.paused = !state.sim.paused;
    document.getElementById('viewModeSelect').onchange = (e) => state.ui.viewMode = e.target.value;
    document.getElementById('activeLayerSelect').onchange = (e) => state.ui.activeLayer = e.target.value;
    document.getElementById('economyModeSelect').onchange = (e) => state.economy.mode = e.target.value;
    document.getElementById('saveBtn').onclick = () => this.game.save();
    document.getElementById('loadBtn').onclick = () => this.game.load();
    document.getElementById('newMapBtn').onclick = () => onNewMap(document.getElementById('mapTemplateSelect').value);

    document.querySelectorAll('[data-crisis]').forEach((b) => b.onclick = () => this.game.triggerCrisis(b.dataset.crisis));

    fillSelect('roadTypeSelect', Object.keys(CONFIG.roadTypes), (v) => state.ui.roadType = v);
    fillSelect('zoneTypeSelect', Object.keys(CONFIG.zoneTypes), (v) => state.ui.zoneType = v);
    fillSelect('buildingTypeSelect', Object.keys(CONFIG.buildingTypes), (v) => state.ui.buildingType = v);
    fillSelect('mapTemplateSelect', MAP_TEMPLATES, () => {});
  }

  bindButtonGroup(sel, onPick, def) {
    const buttons = [...document.querySelectorAll(sel)];
    buttons.forEach((b) => {
      if ((b.dataset.tool || b.dataset.layerView || b.dataset.speed) === def) b.classList.add('active');
      b.onclick = () => {
        buttons.forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        onPick(b);
      };
    });
  }

  showCitizenCard(c) {
    this.game.state.ui.selectedEntity = { type: 'citizen', id: c.id };
    this.game.state.ui.trackedCitizenId = c.id;
  }
  showBuildingCard(b) {
    this.game.state.ui.selectedEntity = { type: 'building', id: b.id };
  }

  render() {
    const { state } = this.game;
    const hud = document.getElementById('hudPanel');
    const avgHappy = state.citizens.length ? state.citizens.reduce((s,c)=>s+c.satisfaction,0)/state.citizens.length : 0;
    state.stats.avgHappiness = avgHappy;
    hud.innerHTML = kv('Население', fmt(state.citizens.length)) + kv('Бюджет', fmt(Math.round(state.economy.budget))) + kv('Счастье', `${Math.round(avgHappy*100)}%`)
      + kv('Активные машины', state.vehicles.length) + kv('Поезда', state.vehicles.filter(v=>v.type==='metro'||v.type==='serviceTrain').length)
      + kv('Аварии', state.stats.accidents) + kv('Активный слой', state.ui.activeLayer) + kv('Скорость', `${state.sim.speed}x`) + kv('День', state.sim.day);

    document.getElementById('statsPanel').innerHTML = kv('Час', state.sim.hour.toFixed(1)) + kv('Пробки', state.stats.congestionScore.toFixed(1))
      + kv('События', state.events.length) + kv('Режим', state.ui.viewMode) + kv('Транспортная связанность', avgConnectivity(state)) + kv('Рейтинг районов', districtComfort(state));

    document.getElementById('issuesPanel').innerHTML = `<strong>Проблемные перекрёстки</strong><ul class="small-list">${topProblemIntersections(state).map(i=>`<li>${i.layer}:${i.x},${i.y} нагрузка ${i.load.toFixed(1)}</li>`).join('')}</ul>`
      + `<strong>Перегруженные службы</strong><ul class="small-list">${overloadedServices(state).map(s=>`<li>${s.key}: ${Math.round(s.load*100)}%</li>`).join('')}</ul>`;

    renderInspector(this.game);
    document.getElementById('transportStats').innerHTML = kv('Всего транспорта', state.vehicles.length) + kv('Метро линий', state.metro.lines.length) + kv('Станций', state.metro.stations.length);
    document.getElementById('serviceStats').innerHTML = Object.entries(state.services).map(([k,v]) => kv(k, `${Math.round(v.coverage*100)}%`)).join('');
    document.getElementById('budgetStats').innerHTML = kv('Доход', Math.round(state.economy.income)) + kv('Расход', Math.round(state.economy.expenses));
    document.getElementById('statusText').textContent = state.ui.status;
  }
}

function fillSelect(id, options, onChange) {
  const s = document.getElementById(id);
  s.innerHTML = options.map((o) => `<option value="${o}">${o}</option>`).join('');
  s.onchange = (e) => onChange(e.target.value);
  onChange(options[0]);
}

const kv = (k,v) => `<div class="kv"><span>${k}</span><strong>${v}</strong></div>`;

function avgConnectivity(state) {
  const ratings = [...districtConnectivity(state).values()];
  if (!ratings.length) return '0';
  return Math.round(ratings.reduce((a,b)=>a+b,0)/ratings.length).toString();
}
function districtComfort(state) {
  if (!state.buildings.length) return '0';
  const score = state.buildings.reduce((s,b)=>s + (b.connectedRoad?35:10) + b.serviceCoverage*65,0) / state.buildings.length;
  return Math.round(score).toString();
}

function renderInspector(game) {
  const { state } = game;
  const root = document.getElementById('inspectorContent');
  const sel = state.ui.selectedEntity;
  if (!sel) { root.textContent = 'Выберите жителя или здание.'; return; }
  if (sel.type === 'citizen') {
    const c = state.citizens.find((x) => x.id === sel.id);
    if (!c) return;
    const home = state.buildings.find((b) => b.id === c.homeId);
    const work = state.buildings.find((b) => b.id === c.workId);
    root.innerHTML = `<div class="kv"><span>Имя</span><strong>${c.name}</strong></div>
      ${kv('Возраст', c.age)}${kv('Образование', c.education)}${kv('Живёт', home ? `${home.type} ${home.id}` : '-')}
      ${kv('Работа', work ? `${work.type} ${work.id}` : '-')}${kv('Куда идёт', c.destination || '-')}${kv('Транспорт', c.preferredTransport)}
      ${kv('Состояние', c.action)}<strong>История маршрутов</strong><ul class="small-list">${c.routeHistory.map((r)=>`<li>День ${r.day} ${r.hour}: ${r.steps} шагов</li>`).join('')}</ul>`;
  } else {
    const b = state.buildings.find((x) => x.id === sel.id);
    if (!b) return;
    root.innerHTML = `${kv('Тип', b.type)}${kv('Название', b.name)}${kv('Вместимость', b.capacity)}${kv('Жильцы', b.residents.length)}
      ${kv('Работники', b.workersAssigned)}${kv('Требуется', b.workersNeeded)}${kv('Эффективность', Math.round(b.efficiency*100)+'%')}
      ${kv('Посещаемость', b.visitors)}${kv('Связь с дорогой', b.connectedRoad ? 'да' : 'нет')}${kv('Покрытие служб', Math.round(b.serviceCoverage*100)+'%')}`;
  }
}
