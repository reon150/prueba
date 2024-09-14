import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from '../service/Trips.service';
import {
  CreateTripRequestDto,
  CreateTripResponseDto,
  GetInvoiceResponseDto,
  GetTripsRequestDto,
  GetTripsResponseDto,
  UpdateTripRequestDto,
  UpdateTripResponseDto,
} from '../dto';
import { PaginationResponseDto } from '../../../common';

describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findInvoiceByTripId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of trips', async () => {
      const paginatedTripsDtoMock = new PaginationResponseDto(
        [new GetTripsResponseDto()],
        20,
        1,
        10,
        'base',
      );
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedTripsDtoMock);

      const queryDtoMock = new GetTripsRequestDto();

      const result = await controller.findAll(queryDtoMock);

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(queryDtoMock);
      expect(result).toEqual(paginatedTripsDtoMock);
    });
  });

  describe('create', () => {
    it('should create and return a trip', async () => {
      const createTripResponseDtoMock = new CreateTripResponseDto();

      jest
        .spyOn(service, 'create')
        .mockResolvedValue(createTripResponseDtoMock);

      const createTripRequestDtoMock = new CreateTripRequestDto();

      const result = await controller.create(createTripRequestDtoMock);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createTripRequestDtoMock);
      expect(result).toEqual(createTripResponseDtoMock);
    });
  });

  describe('update', () => {
    it('should update and return a trip', async () => {
      const tripIdMock = 'b18cc085-f4df-4ee5-a47b-50f29808868e';
      const updateTripResponseDtoMock = new UpdateTripResponseDto();

      jest
        .spyOn(service, 'update')
        .mockResolvedValue(updateTripResponseDtoMock);

      const updateDtoMock = new UpdateTripRequestDto();

      const result = await controller.update(tripIdMock, updateDtoMock);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(tripIdMock, updateDtoMock);
      expect(result).toEqual(updateTripResponseDtoMock);
    });
  });

  describe('getInvoiceByTripId', () => {
    it('should return an invoice for a trip', async () => {
      const tripIdMock = 'ae636189-aef7-4439-a5c9-ddae003f23c7';
      const getInvoiceResponseDtoMock = new GetInvoiceResponseDto();
      getInvoiceResponseDtoMock.tripId = tripIdMock;

      jest
        .spyOn(service, 'findInvoiceByTripId')
        .mockResolvedValue(getInvoiceResponseDtoMock);

      const result = await controller.getInvoiceByTripId(tripIdMock);

      expect(result).toEqual(getInvoiceResponseDtoMock);
      expect(service.findInvoiceByTripId).toHaveBeenCalledTimes(1);
      expect(service.findInvoiceByTripId).toHaveBeenCalledWith(tripIdMock);
    });
  });
});
