import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { DriversService } from './drivers.service';
import { Driver } from '../entities/driver.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../../common';

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
