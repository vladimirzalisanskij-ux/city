import { CONFIG } from './config.js';
import { Renderer } from './renderer.js';
import { UI } from './ui.js';
import { bindInput } from './input.js';
import { updateTime } from './time.js';
import { rebuildIntersections } from './intersections.js';
import { updateTrafficStats } from './traffic.js';
import { updateZoneScores } from './zones.js';
import { assignConnectivity } from './buildings.js';
import { spawnCitizens, updateCitizens } from './citizens.js';
import { spawnVehicles, updateVehicles } from './vehicles.js';
import { ensureServices, updateServices } from './services.js';
import { updateEconomy } from './economy.js';
import { updateEvents, triggerCrisis } from './events.js';
import { updateMetro } from './metro.js';
import { saveGame, loadGame } from './save.js';
import { generateMap } from './mapGenerator.js';

export class Game {
  constructor(state) {
    this.state = state;
    this.canvas = document.getElementById('gameCanvas');
    this.tile = CONFIG.map.tileSize;
    this.renderer = new Renderer(this.canvas, this.state, this.tile);
    this.ui = new UI(this);
    bindInput(this);
    ensureServices(this.state);
    this.bootstrap();
  }

  bootstrap() {
    for (let x = 20; x < 90; x++) {
      this.state.roads.push({ id: x, x, y: 40, layer: 'mid', type: 'road', load: 0, condition: 1, rules: {} });
      this.state.roads.push({ id: 1000 + x, x, y: 70, layer: 'mid', type: 'road', load: 0, condition: 1, rules: {} });
    }
    this.state.layerLinks.push({ ax: 30, ay: 40, aLayer: 'mid', bx: 30, by: 40, bLayer: 'high' });
    this.state.layerLinks.push({ ax: 70, ay: 70, aLayer: 'mid', bx: 70, by: 70, bLayer: 'low' });
  }

  start() {
    const loop = (t) => {
      if (!this.lastTime) this.lastTime = t;
      const dt = Math.min(0.4, (t - this.lastTime) / 1000);
      this.lastTime = t;
      this.update(dt);
      this.render();
      requestAnimationFrame(loop);
    };
    this.renderer.resize();
    window.addEventListener('resize', () => this.renderer.resize());
    requestAnimationFrame(loop);
  }

  update(dt) {
    updateTime(this.state, dt);
    if (this.state.citizens.length < 300 && Math.random() < 0.06 * dt) spawnCitizens(this.state, 8);
    spawnVehicles(this.state);
    updateVehicles(this.state, dt);
    updateCitizens(this.state);
    updateZoneScores(this.state);
    assignConnectivity(this.state);
    updateMetro(this.state, dt);
    updateServices(this.state, dt);
    updateEconomy(this.state, dt);
    updateEvents(this.state, dt);
    rebuildIntersections(this.state);
    updateTrafficStats(this.state);
  }

  render() {
    this.renderer.draw();
    this.ui.render();
  }

  save() { saveGame(this.state); this.state.ui.status = 'Сохранение выполнено'; }
  load() {
    const loaded = loadGame();
    if (loaded) {
      Object.keys(this.state).forEach((k) => delete this.state[k]);
      Object.assign(this.state, loaded);
      this.state.ui.status = 'Загрузка выполнена';
      this.renderer.state = this.state;
      this.ui.game = this;
    }
  }
  onNewMap(template) {
    this.state.map = generateMap(template, CONFIG.map.width, CONFIG.map.height);
    this.state.roads = [];
    this.state.zones = [];
    this.state.buildings = [];
    this.state.citizens = [];
    this.state.vehicles = [];
    this.state.events = [];
    this.state.ui.status = `Новая карта: ${template}`;
    this.bootstrap();
  }
  triggerCrisis(code) { triggerCrisis(this.state, code); }
}
