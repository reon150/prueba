import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { InvoicesService } from './invoices.service';
import { Invoice } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppConfigService } from '../../../config';
import { appConfigServiceMock, repositoryMock } from '../../../common';
import { Trip } from '../../trips/entities';
import * as geoCalculationsUtils from '../../../common/utils/geo-calculations';
import { PaymentStatus } from '../enums';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let invoiceRepository: Repository<Invoice>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: repositoryMock,
        },
        {
          provide: AppConfigService,
          useValue: appConfigServiceMock,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    invoiceRepository = module.get<Repository<Invoice>>(
      getRepositoryToken(Invoice),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(invoiceRepository).toBeDefined();
  });

  describe('findOneByTripId', () => {
    it('should return an invoice for a valid trip ID', async () => {
      const tripId = '8f11e335-55dd-4525-9a48-02720ded862b';
      const expectedInvoice = new Invoice();
      expectedInvoice.tripId = tripId;
      repositoryMock.findOne.mockResolvedValue(expectedInvoice);

      const result = await service.findOneByTripId(tripId);

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { tripId },
      });
      expect(result).toEqual(expectedInvoice);
    });

    it('should return undefined if no invoice is found for the trip ID', async () => {
      const tripId = '6f37701f-d4f3-4689-85b3-d1193cec7cc3';
      repositoryMock.findOne.mockResolvedValue(undefined);

      const result = await service.findOneByTripId(tripId);

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { tripId },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return the saved invoice', async () => {
      const tripMock = new Trip();
      tripMock.id = '9a11b8ef-7789-4b0d-a844-f9e7727f9b6a';
      tripMock.startTime = new Date('2024-01-01T00:00:00Z');
      tripMock.endTime = new Date('2024-01-01T01:00:00Z');

      const invoiceMock = new Invoice();
      invoiceMock.tripId = tripMock.id;

      const invoiceSavedMock = new Invoice();
      invoiceMock.id = '83009385-6535-41ed-a63f-82ce3d0976c3';
      invoiceMock.tripId = tripMock.id;

      repositoryMock.create.mockReturnValue(invoiceMock);
      repositoryMock.save.mockResolvedValue(invoiceSavedMock);

      jest
        .spyOn(geoCalculationsUtils, 'calculateDistanceInKm')
        .mockReturnValue(100);

      const result = await service.create(tripMock);

      expect(repositoryMock.create).toHaveBeenCalledTimes(1);
      expect(repositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tripId: tripMock.id,
          paymentStatus: PaymentStatus.Processing,
        }),
      );
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(invoiceMock);
      expect(result).toEqual(invoiceSavedMock);
    });

    it('should store the correct amount when creating an invoice', async () => {
      const amountMock = 210;

      const tripMock = new Trip();
      tripMock.id = '9a11b8ef-7789-4b0d-a844-f9e7727f9b6a';
      tripMock.startTime = new Date('2024-01-01T00:00:00Z');
      tripMock.endTime = new Date('2024-01-01T01:00:00Z');

      const invoiceMock = new Invoice();
      invoiceMock.tripId = tripMock.id;
      invoiceMock.amount = amountMock;

      const invoiceSavedMock = new Invoice();
      invoiceSavedMock.tripId = tripMock.id;
      invoiceSavedMock.amount = amountMock;

      repositoryMock.create.mockReturnValue(invoiceMock);
      repositoryMock.save.mockResolvedValue(invoiceSavedMock);

      jest
        .spyOn(geoCalculationsUtils, 'calculateDistanceInKm')
        .mockReturnValue(50);

      jest
        .spyOn(appConfigServiceMock as any, 'baseFare', 'get')
        .mockReturnValue(50);
      jest
        .spyOn(appConfigServiceMock as any, 'costPerKm', 'get')
        .mockReturnValue(2);
      jest
        .spyOn(appConfigServiceMock as any, 'costPerMinute', 'get')
        .mockReturnValue(1);

      const result = await service.create(tripMock);

      expect(repositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: amountMock,
        }),
      );
      expect(repositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: amountMock,
        }),
      );
      expect(result.amount).toEqual(amountMock);
    });

    it('should proccess an invoice', async () => {
      jest.useFakeTimers();

      const tripMock = new Trip();
      tripMock.id = '9a11b8ef-7789-4b0d-a844-f9e7727f9b6a';
      tripMock.startTime = new Date('2024-01-01T00:00:00Z');
      tripMock.endTime = new Date('2024-01-01T01:00:00Z');

      const invoiceMock = new Invoice();
      invoiceMock.tripId = tripMock.id;

      jest
        .spyOn(geoCalculationsUtils, 'calculateDistanceInKm')
        .mockReturnValue(50);

      repositoryMock.create.mockReturnValue(invoiceMock);
      repositoryMock.save.mockResolvedValue(invoiceMock);

      await service.create(tripMock);

      jest.runAllTimers();

      const savedInvoice = repositoryMock.save.mock.calls[0][0];
      expect(savedInvoice.paymentStatus).not.toBe(PaymentStatus.Processing);
      expect([PaymentStatus.Paid, PaymentStatus.Unpaid]).toContain(
        savedInvoice.paymentStatus,
      );

      jest.useRealTimers();
    });
  });
});
