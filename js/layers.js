export const Layer = Object.freeze({ HIGH: 'high', MID: 'mid', LOW: 'low' });

export function layerAlpha(viewMode, layer) {
  if (viewMode === layer) return 1;
  if (viewMode === 'combined') return 1;
  if (viewMode === 'transparent') return layer === 'mid' ? 0.7 : 0.45;
  return 0.08;
}
