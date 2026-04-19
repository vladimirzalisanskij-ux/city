import { markServiceHeat } from './map.js';

const SERVICE_KEYS = ['police','fire','health','garbage','mail','road','tow','bus','metro'];

export function ensureServices(state) {
  for (const k of SERVICE_KEYS) {
    if (!state.services[k]) state.services[k] = { bases: 0, vehicles: 0, calls: 0, load: 0, coverage: 0.3 };
  }
}

export function updateServices(state, dt) {
  ensureServices(state);
  const population = state.citizens.length;
  for (const k of SERVICE_KEYS) {
    const s = state.services[k];
    const bases = state.buildings.filter((b) => b.service === mapServiceBuilding(k)).length;
    s.bases = bases;
    s.vehicles = state.vehicles.filter((v) => vehicleService(v.type) === k).length;
    s.calls = Math.round(population * (0.02 + Math.random() * 0.03));
    s.load = Math.min(1, s.calls / Math.max(1, s.bases * 18 + s.vehicles * 6));
    s.coverage = Math.max(0.1, Math.min(1, (s.bases * 0.2 + s.vehicles * 0.015) - s.load * 0.3 + 0.35));
  }
  for (const b of state.buildings) {
    const coverage = (state.services.police.coverage + state.services.fire.coverage + state.services.health.coverage) / 3;
    b.serviceCoverage = coverage;
    markServiceHeat(state, b.x, b.y, b.layer, coverage * dt);
  }
}

function mapServiceBuilding(key) {
  const m = { police: 'police', fire: 'fire', health: 'hospital', garbage: 'garbage', mail: 'post', bus: 'busDepot', metro: 'metroDepot' };
  return m[key];
}
function vehicleService(type) {
  const m = { police: 'police', fire: 'fire', ambulance: 'health', garbage: 'garbage', mail: 'mail', tow: 'tow', roadService: 'road', bus: 'bus', schoolBus: 'bus', metro: 'metro', serviceTrain: 'metro' };
  return m[type] || null;
}

export function overloadedServices(state) {
  return Object.entries(state.services)
    .map(([k, v]) => ({ key: k, load: v.load }))
    .sort((a, b) => b.load - a.load)
    .slice(0, 5);
}
