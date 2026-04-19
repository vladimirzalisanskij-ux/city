import { roadCost } from './roads.js';

export function canAfford(state, amount) {
  return state.economy.mode === 'sandbox' || state.economy.budget >= amount;
}

export function spend(state, amount) {
  if (state.economy.mode === 'sandbox') return true;
  if (!canAfford(state, amount)) return false;
  state.economy.budget -= amount;
  state.economy.expenses += amount;
  return true;
}

export function costForAction(action, type) {
  if (action === 'road') return roadCost(type);
  if (action === 'building') return 500 + (type.includes('Depot') ? 2000 : 0);
  if (action === 'zone') return 12;
  if (action === 'metro') return 200;
  return 10;
}

export function updateEconomy(state, dt) {
  const pop = state.citizens.length;
  const jobs = state.buildings.reduce((s, b) => s + b.jobs, 0);
  const income = (pop * 2 + jobs * 0.6) * state.economy.taxes * dt;
  const maintenance = (state.roads.length * 0.2 + state.buildings.length * 2 + state.vehicles.length * 0.1) * dt;
  state.economy.income += income;
  state.economy.expenses += maintenance;
  if (state.economy.mode === 'budget') state.economy.budget += income - maintenance;
}
