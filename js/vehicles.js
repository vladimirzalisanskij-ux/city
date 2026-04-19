import { CONFIG } from './config.js';
import { pick, key2 } from './utils.js';
import { shortestPath, buildRoadGraph } from './pathfinding.js';
import { markTrafficHeat } from './map.js';

let vehicleId = 1;
const serviceTypes = ['police', 'fire', 'ambulance', 'garbage', 'mail', 'tow', 'roadService', 'bus', 'schoolBus', 'metro', 'serviceTrain'];

export function spawnVehicles(state) {
  if (state.vehicles.length > 260) return;
  const roads = state.roads;
  if (roads.length < 2) return;
  const graph = buildRoadGraph(state);
  for (let i = 0; i < 4; i++) {
    const a = pick(roads); const b = pick(roads);
    const path = shortestPath(graph, key2(a.x, a.y, a.layer), key2(b.x, b.y, b.layer));
    if (path.length < 2) continue;
    const type = Math.random() < 0.2 ? pick(serviceTypes) : pick(['car', 'taxi', 'truck']);
    state.vehicles.push({ id: vehicleId++, type, path, progress: 0, layer: a.layer, speed: speedFor(type) });
  }
}

function speedFor(type) {
  if (type === 'metro' || type === 'serviceTrain') return 1.8;
  if (type.includes('bus')) return 1.1;
  if (type === 'truck') return 0.9;
  return 1.0;
}

export function updateVehicles(state, dt) {
  for (const v of state.vehicles) {
    if (v.path.length < 2) continue;
    v.progress += dt * v.speed * 2;
    const idx = Math.floor(v.progress);
    if (idx >= v.path.length - 1) {
      v.path.reverse();
      v.progress = 0;
      continue;
    }
    const [x, y, layer] = v.path[idx].split(',');
    v.layer = layer;
    markTrafficHeat(state, +x, +y, layer, 1);
    const road = state.roads.find((r) => r.x === +x && r.y === +y && r.layer === layer);
    if (road) road.load = Math.min(100, road.load + 0.4);
  }
  for (const r of state.roads) r.load = Math.max(0, r.load - 0.1 * dt);
}

export function vehicleColor(type) {
  const p = CONFIG.vehiclePalette;
  if (Array.isArray(p[type])) return pick(p[type]);
  return p[type] || '#111827';
}
