export default {
  debugMode: false,
  window: {
    width: 1920,
    height: 1080,
  },
  world: {
    width: 1000,
    height: 1000,
  },
  styles: {
    backgroundColor: '0B1F47',
  },
  entity: {
    maxAcceleration: 1000,
    minMass: 100,
    minVelocity: 100, // Minimal top velocity for the biggest entity.
    maxVelocity: 1000,
    massVelocityCapacity: 100000, // Above this mass, velocity remains constant.
  },
  camera: {
    entityToViewRatio: 30,
  },
  socket: {
    server: 'http://localhost:5000',
    updateRate: 10,
  },
};
