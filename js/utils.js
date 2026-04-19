export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const key2 = (x, y, layer) => `${x},${y},${layer}`;
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const fmt = (n) => n.toLocaleString('ru-RU');

const first = ['Анна','Илья','Мария','Егор','София','Никита','Ольга','Дмитрий','Алиса','Роман','Лев','Зоя'];
const last = ['Иванова','Петров','Смирнова','Кузнецов','Попова','Васильев','Соколов','Фёдоров'];
export const randomName = () => `${pick(first)} ${pick(last)}`;
