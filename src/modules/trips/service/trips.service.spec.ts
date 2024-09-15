import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { InvoicesService } from '../../invoices/service/Invoices.service';
import { InvoiceToDtoMapper } from '../mappers';
import { GetInvoiceResponseDto } from '../dto';
import { NotFoundException } from '@nestjs/common';
import { Trip } from '../entities';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../../common';
import { Invoice } from '../../invoices/entities';
import { PassengersService } from '../../passengers/service/passengers.service';
import { DriversService } from '../../drivers/service/drivers.service';

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
