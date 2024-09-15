export const repositoryMock = {
  find: jest.fn((entity) => Promise.resolve(entity)),
  findOne: jest.fn((id) => Promise.resolve(id)),
  findOneOrFail: jest.fn((id) => Promise.resolve(id)),
  save: jest.fn((entity) => Promise.resolve(entity)),
  remove: jest.fn((entity) => Promise.resolve(entity)),
  create: jest.fn((entity) => entity),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(() => Promise.resolve([])),
    getOne: jest.fn(() => Promise.resolve({})),
  })),
};
