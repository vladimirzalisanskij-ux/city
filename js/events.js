import { pick } from './utils.js';

const eventPool = ['accident','fire','vehicle_breakdown','road_closure','metro_overload','worker_shortage','school_shortage','hospital_shortage','service_problem'];

export function updateEvents(state, dt) {
  if (Math.random() < 0.01 * dt) {
    const kind = pick(eventPool);
    const e = { id: Date.now() + Math.random(), kind, day: state.sim.day, hour: state.sim.hour.toFixed(1) };
    state.events.unshift(e);
    state.events = state.events.slice(0, 20);
    if (kind === 'accident') state.stats.accidents += 1;
  }
  const rush = state.sim.hour >= 7 && state.sim.hour <= 9 || state.sim.hour >= 17 && state.sim.hour <= 19;
  if (rush) for (const r of state.roads) r.load += 0.05 * dt;
}

export function triggerCrisis(state, code) {
  if (code === 'rushhour') {
    for (const r of state.roads) r.load += 20;
    state.events.unshift({ kind: 'forced_rushhour', day: state.sim.day, hour: state.sim.hour.toFixed(1) });
  }
  if (code === 'service_failure') {
    for (const s of Object.values(state.services)) s.coverage *= 0.55;
    state.events.unshift({ kind: 'service_failure', day: state.sim.day, hour: state.sim.hour.toFixed(1) });
  }
  if (code === 'metro_overload') {
    for (const st of state.metro.stations) st.load += 0.6;
    state.events.unshift({ kind: 'metro_overload', day: state.sim.day, hour: state.sim.hour.toFixed(1) });
  }
}
