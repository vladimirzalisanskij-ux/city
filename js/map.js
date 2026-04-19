import { key2 } from './utils.js';

export function tileAt(state, x, y) {
  return state.map.tiles[y]?.[x] ?? null;
}

export function canBuild(state, x, y, layer) {
  const tile = tileAt(state, x, y);
  if (!tile) return false;
  if (layer === 'mid') return tile.buildable && tile.terrain !== 'water';
  return true;
}

export function markTrafficHeat(state, x, y, layer, value = 1) {
  const k = key2(x, y, layer);
  state.heatmaps.traffic.set(k, (state.heatmaps.traffic.get(k) || 0) + value);
}

export function markServiceHeat(state, x, y, layer, value = 1) {
  const k = key2(x, y, layer);
  state.heatmaps.services.set(k, (state.heatmaps.services.get(k) || 0) + value);
}
