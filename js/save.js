const KEY = 'layered_transit_city_save_v1';

export function saveGame(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadGame() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}
