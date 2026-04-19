import { randomName, pick, randInt, key2 } from './utils.js';
import { buildRoadGraph, shortestPath } from './pathfinding.js';

let citizenId = 1;
const edu = ['primary', 'secondary', 'higher'];

export function spawnCitizens(state, count = 4) {
  const homes = state.buildings.filter((b) => ['house', 'apartment'].includes(b.type));
  const jobs = state.buildings.filter((b) => b.jobs > 0);
  if (!homes.length) return;
  for (let i = 0; i < count; i++) {
    const home = pick(homes);
    if (home.capacity && home.residents.length >= home.capacity) continue;
    const work = jobs.length ? pick(jobs) : null;
    const citizen = {
      id: citizenId++,
      name: randomName(),
      age: randInt(18, 70),
      education: pick(edu),
      homeId: home.id,
      workId: work?.id || null,
      action: 'дома',
      destination: null,
      mood: 0.65,
      satisfaction: 0.62,
      preferredTransport: pick(['car', 'bus', 'metro', 'walk']),
      route: [],
      routeHistory: [],
      pos: { x: home.x, y: home.y, layer: home.layer },
      sick: false
    };
    home.residents.push(citizen.id);
    state.citizens.push(citizen);
  }
}

export function updateCitizens(state) {
  const graph = buildRoadGraph(state);
  const now = state.sim.hour;
  for (const c of state.citizens) {
    const home = state.buildings.find((b) => b.id === c.homeId);
    const work = state.buildings.find((b) => b.id === c.workId);
    const goWork = now >= 7 && now <= 9 && work;
    const goHome = now >= 17 && now <= 20;
    const target = goWork ? work : goHome ? home : pick([home, work, home]);
    if (!target) continue;
    const start = key2(c.pos.x, c.pos.y, c.pos.layer);
    const goal = key2(target.x, target.y, target.layer);
    const path = shortestPath(graph, start, goal);
    if (path.length > 1) {
      c.route = path;
      c.destination = target.id;
      c.action = goWork ? 'в пути на работу' : goHome ? 'в пути домой' : 'в поездке';
      c.routeHistory.unshift({ day: state.sim.day, hour: now.toFixed(1), from: start, to: goal, steps: path.length });
      c.routeHistory = c.routeHistory.slice(0, 8);
      const next = path[1].split(',').map((n) => Number.isNaN(+n) ? n : +n);
      c.pos = { x: next[0], y: next[1], layer: next[2] };
      c.mood += 0.001;
    } else {
      c.action = 'ожидает маршрут';
      c.mood -= 0.002;
    }
    c.satisfaction = Math.max(0, Math.min(1, c.mood - (c.sick ? 0.12 : 0)));
  }
}
