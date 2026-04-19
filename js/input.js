import { screenToWorld, applyZoom } from './camera.js';
import { placeRoad } from './roads.js';
import { placeZone } from './zones.js';
import { placeBuilding, buildingAt } from './buildings.js';
import { placeMetroSegment, placeStation } from './metro.js';
import { costForAction, spend } from './economy.js';

export function bindInput(game) {
  const { canvas, state, ui } = game;
  let dragging = false;
  let panning = false;
  let last = null;

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 1 || state.ui.tool === 'pan') { panning = true; last = { x: e.clientX, y: e.clientY }; return; }
    dragging = true;
    handleBuild(game, e);
  });
  canvas.addEventListener('mousemove', (e) => {
    if (panning && last) {
      state.camera.x -= (e.clientX - last.x) / state.camera.zoom;
      state.camera.y -= (e.clientY - last.y) / state.camera.zoom;
      last = { x: e.clientX, y: e.clientY };
      return;
    }
    if (dragging) handleBuild(game, e);
  });
  window.addEventListener('mouseup', () => { dragging = false; panning = false; last = null; });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    applyZoom(state.camera, e.deltaY < 0 ? 0.08 : -0.08, e.offsetX, e.offsetY);
  }, { passive: false });

  canvas.addEventListener('click', (e) => {
    if (state.ui.tool !== 'pan') return;
    const p = screenToWorld(state.camera, e.offsetX, e.offsetY, game.tile);
    const b = buildingAt(state, p.x, p.y, state.ui.activeLayer);
    if (b) return ui.showBuildingCard(b);
    const c = state.citizens.find((z) => z.pos.x === p.x && z.pos.y === p.y && z.pos.layer === state.ui.activeLayer);
    if (c) ui.showCitizenCard(c);
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') state.sim.paused = !state.sim.paused;
    if (e.key === '1') state.ui.activeLayer = 'high';
    if (e.key === '2') state.ui.activeLayer = 'mid';
    if (e.key === '3') state.ui.activeLayer = 'low';
    if (e.key.toLowerCase() === 'v') {
      const modes = ['normal', 'traffic', 'speed', 'noise', 'happiness', 'services', 'education', 'landValue'];
      const i = (modes.indexOf(state.ui.viewMode) + 1) % modes.length;
      state.ui.viewMode = modes[i];
      document.getElementById('viewModeSelect').value = modes[i];
    }
  });
}

function handleBuild(game, e) {
  const { state, tile } = game;
  const p = screenToWorld(state.camera, e.offsetX, e.offsetY, tile);
  const layer = state.ui.activeLayer;
  if (state.ui.tool === 'road' || state.ui.tool === 'bridge' || state.ui.tool === 'tunnel') {
    const type = state.ui.tool === 'road' ? state.ui.roadType : state.ui.tool;
    const cost = costForAction('road', type);
    if (spend(state, cost)) placeRoad(state, p.x, p.y, layer, type);
    return;
  }
  if (state.ui.tool === 'zone') {
    if (spend(state, costForAction('zone'))) placeZone(state, p.x, p.y, layer, state.ui.zoneType);
    return;
  }
  if (state.ui.tool === 'building') {
    if (spend(state, costForAction('building', state.ui.buildingType))) placeBuilding(state, p.x, p.y, layer, state.ui.buildingType);
    return;
  }
  if (state.ui.tool === 'metroLine') {
    if (spend(state, costForAction('metro'))) {
      placeMetroSegment(state, p.x, p.y);
      if (Math.random() < 0.15) placeStation(state, p.x, p.y);
    }
  }
}
