import { CONFIG } from './config.js';
let buildingId = 1;

export function placeBuilding(state, x, y, layer, type) {
  const def = CONFIG.buildingTypes[type];
  if (!def) return false;
  const existing = state.buildings.find((b) => b.x === x && b.y === y && b.layer === layer);
  if (existing) return false;
  state.buildings.push({
    id: buildingId++, x, y, layer, type,
    name: `${type.toUpperCase()}-${buildingId}`,
    capacity: def.cap,
    jobs: def.jobs,
    workersNeeded: def.jobs,
    workersAssigned: 0,
    residents: [],
    visitors: 0,
    efficiency: 0.5,
    service: def.service,
    educationReq: def.education,
    connectedRoad: false,
    serviceCoverage: 0.5
  });
  return true;
}

export function assignConnectivity(state) {
  for (const b of state.buildings) {
    b.connectedRoad = state.roads.some((r) => r.layer === b.layer && Math.abs(r.x - b.x) + Math.abs(r.y - b.y) <= 1);
  }
}

export function buildingAt(state, x, y, layer) {
  return state.buildings.find((b) => b.x === x && b.y === y && b.layer === layer) || null;
}
