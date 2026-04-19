import { clamp } from './utils.js';

export function worldToScreen(camera, x, y, tile) {
  return { x: (x * tile - camera.x) * camera.zoom, y: (y * tile - camera.y) * camera.zoom };
}

export function screenToWorld(camera, sx, sy, tile) {
  return { x: Math.floor((sx / camera.zoom + camera.x) / tile), y: Math.floor((sy / camera.zoom + camera.y) / tile) };
}

export function applyZoom(camera, delta, focusX, focusY) {
  const old = camera.zoom;
  camera.zoom = clamp(camera.zoom + delta, 0.45, 2.8);
  const ratio = camera.zoom / old;
  camera.x = (camera.x + focusX) * ratio - focusX;
  camera.y = (camera.y + focusY) * ratio - focusY;
}
