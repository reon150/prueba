import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { InvoiceToDtoMapper, TripToDtoMapper } from '../mappers';
import {
  CreateTripRequestDto,
  CreateTripResponseDto,
  GetInvoiceResponseDto,
  UpdateTripRequestDto,
  UpdateTripResponseDto,
} from '../dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Trip } from '../entities';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from '../../invoices/entities';
import { PassengersService } from '../../passengers/service/passengers.service';
import { DriversService } from '../../drivers/service/drivers.service';
import { TripStatus } from '../enums';
import { InvoicesService } from '../../invoices/service/invoices.service';
import { repositoryMock } from '../../../common/mocks';

jest.mock('../mappers/invoice-to-dto.mapper');

describe('TripsService', () => {
  let service: TripsService;
  let tripsRepository: Repository<Trip>;
  let invoicesService: InvoicesService;
  let driversService: DriversService;
  let passengersService: PassengersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        {
          provide: getRepositoryToken(Trip),
          useValue: repositoryMock,
        },
        {
          provide: InvoicesService,
          useValue: {
            findOneByTripId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: DriversService,
          useValue: {
            driverExists: jest.fn(),
            isDriverAvailable: jest.fn(),
          },
        },
        {
          provide: PassengersService,
          useValue: {
            passengerExists: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
    tripsRepository = module.get<Repository<Trip>>(getRepositoryToken(Trip));
    invoicesService = module.get<InvoicesService>(InvoicesService);
    driversService = module.get<DriversService>(DriversService);
    passengersService = module.get<PassengersService>(PassengersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tripsRepository).toBeDefined();
    expect(invoicesService).toBeDefined();
    expect(driversService).toBeDefined();
    expect(passengersService).toBeDefined();
  });

  describe('create', () => {
    const createTripRequestDtoMock: CreateTripRequestDto = {
      driverId: '09385a54-5cc5-48dc-aaa1-4aae0c4de4f9',
      passengerId: 'fff263cc-c5d8-455b-9ba9-e3d9e9938916',
      startLatitude: 34.0522,
      startLongitude: -118.2437,
      startTime: new Date(),
    };

    it('should successfully create a trip', async () => {
      const createTripResponseDto = new CreateTripResponseDto();
      const tripMock = new Trip();
      const tripSavedMock = new Trip();
      tripSavedMock.id = '2d804f90-0149-4df6-a0b9-5333cd9e2cc7';

      jest.spyOn(driversService, 'driverExists').mockResolvedValue(true);
      jest.spyOn(driversService, 'isDriverAvailable').mockResolvedValue(true);
      jest.spyOn(passengersService, 'passengerExists').mockResolvedValue(true);
      jest.spyOn(tripsRepository, 'create').mockReturnValue(tripMock);
      jest.spyOn(tripsRepository, 'save').mockResolvedValue(tripSavedMock);
      jest
        .spyOn(TripToDtoMapper, 'toCreateTripResponseDto')
        .mockReturnValue(createTripResponseDto);

      const result = await service.create(createTripRequestDtoMock);

      expect(driversService.driverExists).toHaveBeenCalledWith(
        createTripRequestDtoMock.driverId,
      );
      expect(driversService.isDriverAvailable).toHaveBeenCalledWith(
        createTripRequestDtoMock.driverId,
      );
      expect(passengersService.passengerExists).toHaveBeenCalledWith(
        createTripRequestDtoMock.passengerId,
      );
      expect(tripsRepository.create).toHaveBeenCalledWith(
        createTripRequestDtoMock,
      );
      expect(tripsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TripStatus.Active,
        }),
      );
      expect(result).toEqual(createTripResponseDto);
    });

    it('should throw NotFoundException if driver does not exist', async () => {
      jest.spyOn(driversService, 'driverExists').mockResolvedValue(false);
      jest.spyOn(passengersService, 'passengerExists').mockResolvedValue(true);

      await expect(service.create(createTripRequestDtoMock)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if passenger does not exist', async () => {
      jest.spyOn(driversService, 'driverExists').mockResolvedValue(true);
      jest.spyOn(driversService, 'isDriverAvailable').mockResolvedValue(true);
      jest.spyOn(passengersService, 'passengerExists').mockResolvedValue(false);

      await expect(service.create(createTripRequestDtoMock)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if driver is not available', async () => {
      jest.spyOn(driversService, 'driverExists').mockResolvedValue(true);
      jest.spyOn(driversService, 'isDriverAvailable').mockResolvedValue(false);
      jest.spyOn(passengersService, 'passengerExists').mockResolvedValue(true);

      await expect(service.create(createTripRequestDtoMock)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    let updateTripRequestDtoMock: UpdateTripRequestDto;
    let tripMock: Trip;

    beforeEach(() => {
      tripMock = new Trip();
      tripMock.id = '2d804f90-0149-4df6-a0b9-5333cd9e2cc7';
      tripMock.status = TripStatus.Active;

      updateTripRequestDtoMock = {
        endTime: new Date(),
        endLatitude: 34.0522,
        endLongitude: -118.2437,
        status: TripStatus.Completed,
      };

      jest.clearAllMocks();
    });

    it('should successfully update a trip', async () => {
      const updateTripResponseDtoMock = new UpdateTripResponseDto();

      jest.spyOn(tripsRepository, 'findOne').mockResolvedValue(tripMock);
      jest.spyOn(invoicesService, 'create').mockImplementation();
      jest.spyOn(tripsRepository, 'save').mockResolvedValue(tripMock);
      jest
        .spyOn(TripToDtoMapper, 'toUpdateTripResponseDto')
        .mockReturnValue(updateTripResponseDtoMock);

      const result = await service.update(
        tripMock.id,
        updateTripRequestDtoMock,
      );

      expect(tripsRepository.findOne).toHaveBeenCalledWith({
        where: { id: tripMock.id },
      });
      expect(tripsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateTripRequestDtoMock),
      );
      expect(result).toEqual(updateTripResponseDtoMock);
    });

    it('should throw NotFoundException if the trip does not exist', async () => {
      jest.spyOn(tripsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(tripMock.id, updateTripRequestDtoMock),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if the trip is already completed or canceled', async () => {
      const completedTripMock = { ...tripMock, status: TripStatus.Completed };
      jest
        .spyOn(tripsRepository, 'findOne')
        .mockResolvedValue(completedTripMock);

      await expect(
        service.update(completedTripMock.id, updateTripRequestDtoMock),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if required fields for completed trips are missing', async () => {
      const incompleteUpdateMock = {
        status: TripStatus.Completed,
      };

      jest.spyOn(tripsRepository, 'findOne').mockResolvedValue(tripMock);

      await expect(
        service.update(tripMock.id, incompleteUpdateMock),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create an invoice if the trip status is updated to completed', async () => {
      console.log(tripMock);
      jest.spyOn(tripsRepository, 'findOne').mockResolvedValue(tripMock);
      jest.spyOn(invoicesService, 'create').mockImplementation();
      jest.spyOn(tripsRepository, 'save').mockResolvedValue(tripMock);

      await service.update(tripMock.id, updateTripRequestDtoMock);

      expect(invoicesService.create).toHaveBeenCalledWith(tripMock);
    });
  });

  describe('findInvoiceByTripId', () => {
    it('should return an invoice DTO when an invoice exists for the trip ID', async () => {
      const tripId = '292bd0aa-15a3-4984-87f7-7660151ddbfa';
      const invoiceMock = new Invoice();
      const invoiceResponseDtoMock = new GetInvoiceResponseDto();

      jest
        .spyOn(invoicesService, 'findOneByTripId')
        .mockResolvedValue(invoiceMock);
      jest
        .spyOn(InvoiceToDtoMapper, 'toGetInvoiceResponseDto')
        .mockReturnValue(invoiceResponseDtoMock);

      const result = await service.findInvoiceByTripId(tripId);

      expect(invoicesService.findOneByTripId).toHaveBeenCalledTimes(1);
      expect(invoicesService.findOneByTripId).toHaveBeenCalledWith(tripId);
      expect(InvoiceToDtoMapper.toGetInvoiceResponseDto).toHaveBeenCalledTimes(
        1,
      );
      expect(InvoiceToDtoMapper.toGetInvoiceResponseDto).toHaveBeenCalledWith(
        invoiceMock,
      );
      expect(result).toEqual(invoiceResponseDtoMock);
    });

    it('should throw a NotFoundException when no invoice is found for the trip ID', async () => {
      const tripId = '487d62b7-99b8-47a9-b8ab-ce274c153ac2';

      jest.spyOn(invoicesService, 'findOneByTripId').mockResolvedValue(null);

      await expect(service.findInvoiceByTripId(tripId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
