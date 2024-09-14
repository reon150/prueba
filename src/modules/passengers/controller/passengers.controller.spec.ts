import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from '../service/passengers.service';
import {
  GetPassengerResponseDto,
  GetPassengersRequestDto,
  GetPassengersResponseDto,
} from '../dto';
import { PaginationResponseDto } from '../../../common';

describe('PassengersController', () => {
  let controller: PassengersController;
  let service: PassengersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [
        {
          provide: PassengersService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PassengersController>(PassengersController);
    service = module.get<PassengersService>(PassengersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single passenger', async () => {
      const passengerIdMock = '4e4ae842-0061-467a-a988-78f4558488a0';
      const getPassengerResponseDtoMock = new GetPassengerResponseDto();

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(getPassengerResponseDtoMock);

      const result = await controller.findOne(passengerIdMock);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(passengerIdMock);
      expect(result).toEqual(getPassengerResponseDtoMock);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of passengers', async () => {
      const getPassengersPaginatedResponseDtoMock = new PaginationResponseDto(
        [new GetPassengersResponseDto()],
        20,
        2,
        10,
        'base',
      );
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(getPassengersPaginatedResponseDtoMock);

      const queryDtoMock = new GetPassengersRequestDto();
      queryDtoMock.page = 1;
      queryDtoMock.limit = 10;
      const result = await controller.findAll(queryDtoMock);

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(queryDtoMock);
      expect(result).toEqual(getPassengersPaginatedResponseDtoMock);
    });
  });
});
