import { CONFIG } from './config.js';
let zoneId = 1;

export function placeZone(state, x, y, layer, type) {
  const existing = state.zones.find((z) => z.x === x && z.y === y && z.layer === layer);
  if (existing) { existing.type = type; return; }
  state.zones.push({ id: zoneId++, x, y, layer, type, color: CONFIG.zoneTypes[type].color, desirability: 0.5 });
}

export function updateZoneScores(state) {
  for (const z of state.zones) {
    const traffic = state.roads.filter((r) => r.layer === z.layer && Math.abs(r.x-z.x)+Math.abs(r.y-z.y)<=3).length;
    z.desirability = Math.max(0, Math.min(1, 0.4 + traffic * 0.03));
  }
}
