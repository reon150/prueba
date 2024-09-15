export const appConfigServiceMock = {
  get appEnv() {
    return jest.fn();
  },
  get appPort() {
    return jest.fn();
  },
  get dbHost() {
    return jest.fn();
  },
  get dbPort() {
    return jest.fn();
  },
  get dbUsername() {
    return jest.fn();
  },
  get dbPassword() {
    return jest.fn();
  },
  get dbName() {
    return jest.fn();
  },
  get baseFare() {
    return jest.fn();
  },
  get costPerKm() {
    return jest.fn();
  },
  get costPerMinute() {
    return jest.fn();
  },
};
