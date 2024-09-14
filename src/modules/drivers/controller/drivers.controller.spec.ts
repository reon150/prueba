import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from '../service/drivers.service';
import {
  GetDriverResponseDto,
  GetDriversResponseDto,
  GetNearbyDriversResponseDto,
} from '../dto';
import { PaginationResponseDto } from '../../../common';

describe('DriversController', () => {
  let controller: DriversController;
  let service: DriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [
        {
          provide: DriversService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            findNearby: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DriversController>(DriversController);
    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a driver', async () => {
      const driverIdMock = 'e7805602-2165-4af8-945d-438a94cdb8f2';
      const getDriverResponseDtoMock = new GetDriverResponseDto();

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(getDriverResponseDtoMock);

      const result = await controller.findOne(driverIdMock);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(driverIdMock);
      expect(result).toEqual(getDriverResponseDtoMock);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of drivers', async () => {
      const getDriversPaginatedResponseDtoMock = new PaginationResponseDto(
        [new GetDriversResponseDto()],
        10,
        1,
        5,
        'basePath',
      );

      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(getDriversPaginatedResponseDtoMock);

      const queryDtoMock = { page: 1, limit: 10 };
      const result = await controller.findAll(queryDtoMock);

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(queryDtoMock);
      expect(result).toEqual(getDriversPaginatedResponseDtoMock);
    });
  });

  describe('findNearby', () => {
    it('should return an array of nearby drivers', async () => {
      const getNearbyDriversResponseDtoMock = [
        new GetNearbyDriversResponseDto(),
      ];

      jest
        .spyOn(service, 'findNearby')
        .mockResolvedValue(getNearbyDriversResponseDtoMock);

      const queryDtoMock = { latitude: 40.712776, longitude: -74.005974 };
      const result = await controller.findNearby(queryDtoMock);

      expect(service.findNearby).toHaveBeenCalledTimes(1);
      expect(service.findNearby).toHaveBeenCalledWith(queryDtoMock);
      expect(result).toEqual(getNearbyDriversResponseDtoMock);
    });
  });
});
