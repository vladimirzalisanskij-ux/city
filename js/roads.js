import { CONFIG } from './config.js';
import { canBuild } from './map.js';

let roadId = 1;

export function placeRoad(state, x, y, layer, type) {
  if (!canBuild(state, x, y, layer) && !['bridge', 'tunnel', 'metro'].includes(type)) return false;
  const existing = state.roads.find((r) => r.x === x && r.y === y && r.layer === layer);
  if (existing) {
    existing.type = type;
    return true;
  }
  state.roads.push({ id: roadId++, x, y, layer, type, load: 0, condition: 1, rules: defaultRules() });
  return true;
}

export function defaultRules() {
  return {
    trafficLight: true,
    priority: 'normal',
    yield: false,
    noLeft: false,
    noRight: false,
    noUTurn: false,
    noEntry: false,
    laneDirections: ['fwd'],
    laneConnections: []
  };
}

export function roadNeighbors(state, x, y, layer) {
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  return dirs
    .map(([dx,dy]) => state.roads.find((r) => r.x === x + dx && r.y === y + dy && r.layer === layer))
    .filter(Boolean);
}

export function roadCost(type) {
  return CONFIG.roadTypes[type]?.cost ?? 10;
}
