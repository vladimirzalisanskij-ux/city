export function updateTrafficStats(state) {
  const roads = state.roads.length || 1;
  const loadSum = state.roads.reduce((s, r) => s + r.load, 0);
  state.stats.congestionScore = loadSum / roads;
}

export function districtConnectivity(state) {
  const score = new Map();
  for (const b of state.buildings) {
    const near = state.roads.filter((r) => r.layer === b.layer && Math.abs(r.x - b.x) + Math.abs(r.y - b.y) <= 2).length;
    score.set(b.id, Math.min(100, near * 12));
  }
  return score;
}
