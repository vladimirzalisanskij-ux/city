export const CONFIG = {
  map: { width: 120, height: 120, tileSize: 24 },
  layers: ['high', 'mid', 'low'],
  roadTypes: {
    road: { speed: 1, cost: 8, capacity: 12, width: 1 },
    wide: { speed: 1.1, cost: 12, capacity: 20, width: 2 },
    oneway: { speed: 1.2, cost: 10, capacity: 15, width: 1 },
    arterial: { speed: 1.4, cost: 20, capacity: 30, width: 2 },
    highway: { speed: 1.8, cost: 26, capacity: 45, width: 2 },
    bridge: { speed: 1.3, cost: 40, capacity: 20, width: 1 },
    elevated: { speed: 1.5, cost: 44, capacity: 24, width: 2 },
    tunnel: { speed: 1.4, cost: 60, capacity: 26, width: 1 },
    service: { speed: 0.9, cost: 6, capacity: 8, width: 1 },
    buslane: { speed: 1.2, cost: 14, capacity: 16, width: 1 },
    feeder: { speed: 1.0, cost: 9, capacity: 10, width: 1 },
    ramp: { speed: 1.3, cost: 16, capacity: 12, width: 1 }
  },
  zoneTypes: {
    lowres: { color: '#d8f5d2', demand: 'residential' },
    highres: { color: '#b8eec4', demand: 'residential' },
    office: { color: '#d6e7ff', demand: 'jobs' },
    retail: { color: '#ffe8c2', demand: 'shops' },
    industry: { color: '#e3d5c5', demand: 'production' },
    park: { color: '#c4f1d9', demand: 'comfort' }
  },
  buildingTypes: {
    house: { zone: 'lowres', cap: 8, jobs: 0, service: null, education: 'primary' },
    apartment: { zone: 'highres', cap: 30, jobs: 0, service: null, education: 'secondary' },
    office: { zone: 'office', cap: 0, jobs: 35, service: null, education: 'higher' },
    shop: { zone: 'retail', cap: 0, jobs: 12, service: null, education: 'secondary' },
    school: { zone: 'park', cap: 220, jobs: 30, service: 'education', education: 'higher' },
    hospital: { zone: 'park', cap: 150, jobs: 45, service: 'health', education: 'higher' },
    police: { zone: 'park', cap: 0, jobs: 30, service: 'police', education: 'secondary' },
    fire: { zone: 'park', cap: 0, jobs: 26, service: 'fire', education: 'secondary' },
    garbage: { zone: 'industry', cap: 0, jobs: 28, service: 'garbage', education: 'secondary' },
    post: { zone: 'industry', cap: 0, jobs: 18, service: 'mail', education: 'secondary' },
    busDepot: { zone: 'industry', cap: 0, jobs: 22, service: 'bus', education: 'secondary' },
    metroDepot: { zone: 'industry', cap: 0, jobs: 24, service: 'metro', education: 'secondary' },
    admin: { zone: 'office', cap: 0, jobs: 40, service: 'admin', education: 'higher' }
  },
  vehiclePalette: {
    car: ['#4f79ff', '#58b2ff', '#7c8da1', '#334155'],
    taxi: '#f6c021',
    truck: ['#8b5e34', '#9a6d3e', '#6b7280'],
    bus: '#1565c0',
    police: '#1e40af',
    fire: '#c62828',
    ambulance: '#d32f2f',
    garbage: '#2e7d32',
    mail: '#ef6c00',
    tow: '#f59e0b',
    roadService: '#546e7a',
    schoolBus: '#f9a825',
    metro: '#6d28d9',
    serviceTrain: '#4b5563'
  },
  economy: {
    startBudget: 250000,
    taxes: 0.12,
    maintenanceFactor: 0.03
  }
};

export const MAP_TEMPLATES = ['empty', 'river', 'coast', 'hills', 'bridgeCorridors', 'tunnelCorridors', 'restricted'];
