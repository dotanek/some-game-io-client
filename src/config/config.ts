export default {
  debugMode: true,
  window: {
    width: 1920,
    height: 1080,
  },
  world: {
    width: 10000,
    height: 10000,
  },
  styles: {
    backgroundColor: '0B1F47',
  },
  entity: {
    maxAcceleration: 1000,
    minMass: 100,
    minVelocity: 100, // Minimal top velocity for the biggest entity.
    maxVelocity: 10000,
    massVelocityCapacity: 100000, // Above this mass, velocity remains constant.
  },
  camera: {
    minZoom: 1,
    entityToViewRatio: 30
  }
};
