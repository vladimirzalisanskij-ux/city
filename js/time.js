export function updateTime(state, dt) {
  if (state.sim.paused) return;
  state.sim.tick += dt * state.sim.speed;
  state.sim.hour += dt * state.sim.speed * 0.25;
  if (state.sim.hour >= 24) {
    state.sim.hour -= 24;
    state.sim.day += 1;
  }
}
