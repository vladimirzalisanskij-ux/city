let lineId = 1;
let stationId = 1;

export function placeMetroSegment(state, x, y) {
  const layer = 'low';
  const existing = state.roads.find((r) => r.x === x && r.y === y && r.layer === layer);
  if (!existing) state.roads.push({ id: 100000 + lineId * 1000 + x + y, x, y, layer, type: 'tunnel', load: 0, condition: 1, rules: {} });
  let line = state.metro.lines[0];
  if (!line) {
    line = { id: lineId++, name: 'M1', points: [], frequency: 8 };
    state.metro.lines.push(line);
  }
  line.points.push({ x, y, layer });
}

export function placeStation(state, x, y) {
  const s = { id: stationId++, x, y, layer: 'low', load: 0, transfers: 0 };
  state.metro.stations.push(s);
}

export function updateMetro(state, dt) {
  for (const st of state.metro.stations) {
    st.load = Math.max(0, st.load + (Math.random() - 0.45) * 0.08 * dt);
    st.transfers = Math.round(st.load * 300);
  }
}
