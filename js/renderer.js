import { layerAlpha } from './layers.js';
import { worldToScreen } from './camera.js';
import { vehicleColor } from './vehicles.js';
import { key2 } from './utils.js';

export class Renderer {
  constructor(canvas, state, tile) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = state;
    this.tile = tile;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width * devicePixelRatio);
    this.canvas.height = Math.floor(rect.height * devicePixelRatio);
    this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  draw() {
    const { ctx, state } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTerrain();
    for (const layer of ['low', 'mid', 'high']) this.drawLayer(layer, layerAlpha(state.ui.layerView, layer));
    this.drawSelectionAndTrackedRoute();
  }

  drawTerrain() {
    const { ctx, state, tile } = this;
    const mode = state.ui.viewMode;
    for (let y = 0; y < state.map.height; y++) for (let x = 0; x < state.map.width; x++) {
      const t = state.map.tiles[y][x];
      const p = worldToScreen(state.camera, x, y, tile);
      const w = tile * state.camera.zoom;
      ctx.fillStyle = t.terrain === 'water' ? '#9cd4ff' : '#dff4dc';
      if (mode === 'landValue') {
        const v = Math.min(1, t.landValue);
        ctx.fillStyle = `rgb(${230 - v * 100},${245 - v * 40},${210 + v * 20})`;
      }
      ctx.fillRect(p.x, p.y, w, w);
    }
  }

  drawLayer(layer, alpha) {
    const { ctx, state, tile } = this;
    ctx.globalAlpha = alpha;

    for (const z of state.zones.filter((z) => z.layer === layer)) {
      const p = worldToScreen(state.camera, z.x, z.y, tile);
      ctx.fillStyle = z.color;
      ctx.fillRect(p.x + 2, p.y + 2, tile * state.camera.zoom - 4, tile * state.camera.zoom - 4);
    }

    for (const r of state.roads.filter((r) => r.layer === layer)) {
      const p = worldToScreen(state.camera, r.x, r.y, tile);
      ctx.fillStyle = roadColor(state.ui.viewMode, r, state);
      ctx.fillRect(p.x + 5, p.y + 5, tile * state.camera.zoom - 10, tile * state.camera.zoom - 10);
    }

    for (const b of state.buildings.filter((b) => b.layer === layer)) {
      const p = worldToScreen(state.camera, b.x, b.y, tile);
      ctx.fillStyle = buildingColor(b.type);
      ctx.fillRect(p.x + 3, p.y + 3, tile * state.camera.zoom - 6, tile * state.camera.zoom - 6);
    }

    for (const c of state.citizens.filter((c) => c.pos.layer === layer)) {
      const p = worldToScreen(state.camera, c.pos.x, c.pos.y, tile);
      ctx.fillStyle = state.ui.viewMode === 'happiness' ? `rgb(${220-c.satisfaction*120},${80+c.satisfaction*150},110)` : '#111827';
      ctx.fillRect(p.x + 8, p.y + 8, 5, 5);
    }

    for (const v of state.vehicles.filter((v) => v.layer === layer)) {
      const idx = Math.floor(v.progress);
      const node = v.path[idx]?.split(',');
      if (!node) continue;
      const p = worldToScreen(state.camera, +node[0], +node[1], tile);
      ctx.fillStyle = vehicleColor(v.type);
      ctx.fillRect(p.x + 6, p.y + 10, 10, 4);
    }

    ctx.globalAlpha = 1;
  }

  drawSelectionAndTrackedRoute() {
    const { ctx, state, tile } = this;
    const trackedId = state.ui.trackedCitizenId;
    if (!trackedId) return;
    const c = state.citizens.find((x) => x.id === trackedId);
    if (!c || !c.route?.length) return;
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.beginPath();
    c.route.forEach((node, i) => {
      const [x, y] = node.split(',').map(Number);
      const p = worldToScreen(state.camera, x, y, tile);
      const px = p.x + (tile * state.camera.zoom) / 2;
      const py = p.y + (tile * state.camera.zoom) / 2;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }
}

function roadColor(mode, road, state) {
  if (mode === 'traffic') return `rgb(${120 + road.load*1.2}, ${180-road.load}, ${180-road.load})`;
  if (mode === 'speed') return `rgb(${100}, ${100 + (100-road.load)}, ${220})`;
  if (mode === 'noise') return road.layer === 'high' ? '#8d6e63' : '#9e9e9e';
  if (mode === 'services') {
    const heat = state.heatmaps.services.get(key2(road.x, road.y, road.layer)) || 0;
    return `rgb(${170-heat*20},${170+heat*10},${170-heat*30})`;
  }
  return road.layer === 'high' ? '#7d8794' : road.layer === 'mid' ? '#6b7280' : '#4b5563';
}

function buildingColor(type) {
  if (['house', 'apartment'].includes(type)) return '#9ccc65';
  if (['office', 'admin'].includes(type)) return '#90caf9';
  if (['shop'].includes(type)) return '#ffcc80';
  if (['school'].includes(type)) return '#ffe082';
  if (['hospital'].includes(type)) return '#ef9a9a';
  if (['police','fire','garbage','post','busDepot','metroDepot'].includes(type)) return '#b0bec5';
  return '#cfd8dc';
}
