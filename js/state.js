import { CONFIG } from './config.js';
import { generateMap } from './mapGenerator.js';

export function createInitialState() {
  const map = generateMap('empty', CONFIG.map.width, CONFIG.map.height);
  return {
    map,
    camera: { x: 0, y: 0, zoom: 1 },
    ui: {
      tool: 'pan',
      activeLayer: 'mid',
      layerView: 'combined',
      roadType: 'road',
      zoneType: 'lowres',
      buildingType: 'house',
      viewMode: 'normal',
      status: 'Готово',
      selectedEntity: null,
      trackedCitizenId: null
    },
    sim: {
      paused: false,
      speed: 1,
      day: 1,
      hour: 6,
      tick: 0
    },
    economy: {
      mode: 'sandbox',
      budget: CONFIG.economy.startBudget,
      income: 0,
      expenses: 0,
      taxes: CONFIG.economy.taxes
    },
    roads: [],
    intersections: [],
    layerLinks: [],
    zones: [],
    buildings: [],
    citizens: [],
    vehicles: [],
    metro: { lines: [], stations: [], depotIds: [] },
    services: {},
    heatmaps: { traffic: new Map(), services: new Map() },
    events: [],
    stats: { accidents: 0, avgHappiness: 0, congestionScore: 0 }
  };
}
