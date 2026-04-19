import { roadNeighbors } from './roads.js';

export function rebuildIntersections(state) {
  state.intersections = [];
  for (const road of state.roads) {
    const n = roadNeighbors(state, road.x, road.y, road.layer);
    if (n.length >= 3) {
      state.intersections.push({
        x: road.x,
        y: road.y,
        layer: road.layer,
        type: n.length === 4 ? 'x' : 't',
        load: n.reduce((s, r) => s + r.load, 0),
        rules: road.rules
      });
    }
  }
}

export function topProblemIntersections(state, limit = 5) {
  return [...state.intersections].sort((a, b) => b.load - a.load).slice(0, limit);
}
