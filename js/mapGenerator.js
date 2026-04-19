import { randInt } from './utils.js';

export function generateMap(template, width, height) {
  const tiles = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      terrain: 'grass',
      buildable: true,
      bridgeHint: false,
      tunnelHint: false,
      landValue: 0.5,
      elevation: 0
    }))
  );

  const paintRiver = () => {
    let cy = Math.floor(height / 2);
    for (let x = 0; x < width; x++) {
      cy += randInt(-1, 1);
      cy = Math.max(4, Math.min(height - 5, cy));
      for (let w = -2; w <= 2; w++) {
        const y = cy + w;
        if (tiles[y]?.[x]) {
          tiles[y][x].terrain = 'water';
          tiles[y][x].buildable = false;
          tiles[y][x].bridgeHint = true;
        }
      }
    }
  };

  if (template === 'river') paintRiver();
  if (template === 'coast') {
    const coastY = Math.floor(height * 0.25);
    for (let y = 0; y < coastY; y++) {
      for (let x = 0; x < width; x++) {
        tiles[y][x].terrain = 'water';
        tiles[y][x].buildable = false;
      }
    }
  }
  if (template === 'hills') {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) tiles[y][x].elevation = randInt(0, 3);
  }
  if (template === 'bridgeCorridors') {
    paintRiver();
    for (let x = 5; x < width; x += 15) {
      for (let y = 0; y < height; y++) if (tiles[y][x].terrain === 'water') tiles[y][x].bridgeHint = true;
    }
  }
  if (template === 'tunnelCorridors') {
    for (let y = 12; y < height; y += 16) for (let x = 0; x < width; x++) tiles[y][x].tunnelHint = true;
  }
  if (template === 'restricted') {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if ((x + y) % 11 === 0) tiles[y][x].buildable = false;
  }

  return { width, height, template, tiles };
}
