import { key2 } from './utils.js';

export function buildRoadGraph(state) {
  const graph = new Map();
  for (const r of state.roads) graph.set(key2(r.x, r.y, r.layer), []);
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const r of state.roads) {
    const edges = graph.get(key2(r.x, r.y, r.layer));
    for (const [dx, dy] of dirs) {
      const n = state.roads.find((p) => p.x === r.x + dx && p.y === r.y + dy && p.layer === r.layer);
      if (n) edges.push({ to: key2(n.x, n.y, n.layer), cost: 1 + n.load * 0.04 });
    }
  }
  for (const link of state.layerLinks) {
    const a = key2(link.ax, link.ay, link.aLayer);
    const b = key2(link.bx, link.by, link.bLayer);
    if (graph.has(a) && graph.has(b)) {
      graph.get(a).push({ to: b, cost: 1.4 });
      graph.get(b).push({ to: a, cost: 1.4 });
    }
  }
  return graph;
}

export function shortestPath(graph, start, goal) {
  if (!graph.has(start) || !graph.has(goal)) return [];
  const dist = new Map([[start, 0]]);
  const prev = new Map();
  const q = new Set(graph.keys());
  while (q.size) {
    let u = null;
    let best = Infinity;
    for (const node of q) {
      const d = dist.get(node) ?? Infinity;
      if (d < best) { best = d; u = node; }
    }
    if (!u || u === goal) break;
    q.delete(u);
    for (const e of graph.get(u)) {
      const alt = best + e.cost;
      if (alt < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, alt);
        prev.set(e.to, u);
      }
    }
  }
  const path = [];
  let cur = goal;
  while (cur && cur !== start) {
    path.unshift(cur);
    cur = prev.get(cur);
  }
  if (cur === start) path.unshift(start);
  return path;
}
