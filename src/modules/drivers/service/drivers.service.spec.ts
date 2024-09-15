import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { DriversService } from './drivers.service';
import { Driver } from '../entities/driver.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../../common/mocks';
import { DriverToDtoMapper } from '../mappers';
import {
  GetDriverResponseDto,
  GetDriversRequestDto,
  GetDriversRequestSortByDto,
  GetDriversResponseDto,
} from '../dto';
import { NotFoundException } from '@nestjs/common';
import { PaginationResponseDto } from '../../../common';

describe('DriversService', () => {
  let service: DriversService;
  let driversRepository: Repository<Driver>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        {
          provide: getRepositoryToken(Driver),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
    driversRepository = module.get<Repository<Driver>>(
      getRepositoryToken(Driver),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(driversRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a driver DTO if the driver exists', async () => {
      const driverId = '82895cee-66bd-4505-8464-54165ea627d1';
      const driverMock = new Driver();
      const driverResponseDtoMock = new GetDriverResponseDto();

      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(driverMock);
      jest
        .spyOn(DriverToDtoMapper, 'toGetDriverResponseDto')
        .mockReturnValue(driverResponseDtoMock);

      const result = await service.findOne(driverId);

      expect(driversRepository.findOne).toHaveBeenCalledWith({
        where: { id: driverId },
        relations: ['trips', 'trips.passenger'],
      });
      expect(DriverToDtoMapper.toGetDriverResponseDto).toHaveBeenCalledWith(
        driverMock,
      );
      expect(result).toEqual(driverResponseDtoMock);
    });

    it('should throw a NotFoundException if the driver does not exist', async () => {
      const driverId = '15bc0e8f-75c6-47c6-ab56-597a50829efa';

      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(driverId)).rejects.toThrow(
        new NotFoundException(`Driver with ID ${driverId} not found`),
      );
    });
  });

  describe('findAll', () => {
    const query: GetDriversRequestDto = {
      page: 1,
      limit: 10,
      sortBy: GetDriversRequestSortByDto.name,
      sortOrder: 'ASC',
      isAvailable: true,
    };

    it('should return paginated drivers when drivers exist', async () => {
      const driversMock = [new Driver(), new Driver()];
      const totalDrivers = 2;
      const paginationResponseMock = new PaginationResponseDto(
        driversMock,
        totalDrivers,
        query.page,
        query.limit,
        'drivers',
      );
      const driversResponseDtoMock = [
        new GetDriversResponseDto(),
        new GetDriversResponseDto(),
      ];

      jest
        .spyOn(driversRepository, 'findAndCount')
        .mockResolvedValue([driversMock, totalDrivers]);
      jest
        .spyOn(DriverToDtoMapper, 'toGetDriversResponseDto')
        .mockReturnValue(driversResponseDtoMock);

      const result = await service.findAll(query);

      expect(driversRepository.findAndCount).toHaveBeenCalledWith({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where: { isAvailable: query.isAvailable },
        order: { [query.sortBy]: query.sortOrder },
      });
      expect(DriverToDtoMapper.toGetDriversResponseDto).toHaveBeenCalledWith(
        driversMock,
      );
      expect(result).toEqual(paginationResponseMock);
    });

    it('should return drivers without filtering by availability when isAvailable is not provided', async () => {
      const queryWithoutAvailability: GetDriversRequestDto = {
        page: 1,
        limit: 10,
        sortBy: GetDriversRequestSortByDto.name,
        sortOrder: 'ASC',
      };
      const driversMock = [new Driver(), new Driver()];
      const totalDrivers = 2;
      const paginationResponseMock = new PaginationResponseDto(
        driversMock,
        totalDrivers,
        queryWithoutAvailability.page,
        queryWithoutAvailability.limit,
        'drivers',
      );
      const driversResponseDtoMock = [
        new GetDriversResponseDto(),
        new GetDriversResponseDto(),
      ];

      jest
        .spyOn(driversRepository, 'findAndCount')
        .mockResolvedValue([driversMock, totalDrivers]);
      jest
        .spyOn(DriverToDtoMapper, 'toGetDriversResponseDto')
        .mockReturnValue(driversResponseDtoMock);

      const result = await service.findAll(queryWithoutAvailability);

      expect(driversRepository.findAndCount).toHaveBeenCalledWith({
        skip:
          (queryWithoutAvailability.page - 1) * queryWithoutAvailability.limit,
        take: queryWithoutAvailability.limit,
        where: {},
        order: {
          [queryWithoutAvailability.sortBy]: queryWithoutAvailability.sortOrder,
        },
      });
      expect(DriverToDtoMapper.toGetDriversResponseDto).toHaveBeenCalledWith(
        driversMock,
      );
      expect(result).toEqual(paginationResponseMock);
    });
  });

  describe('driverExists', () => {
    it('should return true if driver exists', async () => {
      const driverId = '14797f88-ed1f-434a-b1eb-1e242a433ae1';

      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(new Driver());

      const exists = await service.driverExists(driverId);

      expect(driversRepository.findOne).toHaveBeenCalledTimes(1);
      expect(driversRepository.findOne).toHaveBeenCalledWith({
        where: { id: driverId },
      });
      expect(exists).toBe(true);
    });

    it('should return false if driver does not exist', async () => {
      const driverId = 'c4a9c185-12b8-4301-8050-f39425c48449';
      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(undefined);

      const exists = await service.driverExists(driverId);

      expect(driversRepository.findOne).toHaveBeenCalledTimes(1);
      expect(driversRepository.findOne).toHaveBeenCalledWith({
        where: { id: driverId },
      });
      expect(exists).toBe(false);
    });
  });

  describe('isDriverAvailable', () => {
    it('should return true if the driver is available', async () => {
      const driverId = '4ccaa681-0258-46be-a70c-8ce156ab7126';
      const driverMock = new Driver();
      driverMock.isAvailable = true;
      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(driverMock);

      const available = await service.isDriverAvailable(driverId);

      expect(driversRepository.findOne).toHaveBeenCalledTimes(1);
      expect(driversRepository.findOne).toHaveBeenCalledWith({
        where: { id: driverId },
      });
      expect(available).toBe(true);
    });

    it('should return false if the driver is not available', async () => {
      const driverId = '31efe766-95ea-42c9-8b15-12c95adc72e3';
      const mockDriver = new Driver();
      mockDriver.isAvailable = false;
      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(mockDriver);

      const available = await service.isDriverAvailable(driverId);

      expect(driversRepository.findOne).toHaveBeenCalledTimes(1);
      expect(driversRepository.findOne).toHaveBeenCalledWith({
        where: { id: driverId },
      });
      expect(available).toBe(false);
    });

    it('should return false if the driver does not exist', async () => {
      const driverId = '2ec36e5e-ed08-423a-9f89-1308770e15a3';
      jest.spyOn(driversRepository, 'findOne').mockResolvedValue(undefined);

      const available = await service.isDriverAvailable(driverId);

      expect(driversRepository.findOne).toHaveBeenCalledTimes(1);
      expect(driversRepository.findOne).toHaveBeenCalledWith({
        where: { id: driverId },
      });
      expect(available).toBe(false);
    });
  });
});
