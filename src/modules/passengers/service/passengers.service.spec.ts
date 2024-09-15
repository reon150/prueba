import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { Passenger } from '../entities/passenger.entity';
import { PassengerToDtoMapper } from '../mappers';
import {
  GetPassengerResponseDto,
  GetPassengersRequestDto,
  GetPassengersResponseDto,
  PassengerSortBy,
} from '../dto';
import { repositoryMock } from '../../../common/mocks';
import { PaginationResponseDto, SortOrder } from '../../../common';

describe('PassengersService', () => {
  let service: PassengersService;
  let passengersRepository: Repository<Passenger>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengersService,
        {
          provide: getRepositoryToken(Passenger),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<PassengersService>(PassengersService);
    passengersRepository = module.get<Repository<Passenger>>(
      getRepositoryToken(Passenger),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(passengersRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a passenger DTO when a passenger exists', async () => {
      const passengerId = 'ff3a2dc8-a5a7-4487-b04b-fa15b3be47ed';
      const passengerMock = new Passenger();
      const getPassengerResponseDtoMock = new GetPassengerResponseDto();

      jest
        .spyOn(passengersRepository, 'findOne')
        .mockResolvedValue(passengerMock);

      jest
        .spyOn(PassengerToDtoMapper, 'toGetPassengerResponseDto')
        .mockReturnValue(getPassengerResponseDtoMock);

      const result = await service.findOne(passengerId);

      expect(passengersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(passengersRepository.findOne).toHaveBeenCalledWith({
        where: { id: passengerId },
        relations: ['trips', 'trips.driver'],
      });
      expect(result).toEqual(getPassengerResponseDtoMock);
    });

    it('should throw a NotFoundException when no passenger is found', async () => {
      const passengerId = '9c76b88b-ff76-4723-aa49-f0b3de7bb09c';

      jest.spyOn(passengersRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(passengerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated passengers when passengers exist', async () => {
      const queryMock: GetPassengersRequestDto = {
        page: 1,
        limit: 10,
        sortBy: PassengerSortBy.name,
        sortOrder: SortOrder.ASC,
      };
      const passengersMock = [new Passenger(), new Passenger()];
      const totalPassengers = 2;
      const paginationResponseMock = new PaginationResponseDto(
        passengersMock,
        totalPassengers,
        queryMock.page,
        queryMock.limit,
        'passengers',
      );
      const passengersResponseDtoMock = [
        new GetPassengersResponseDto(),
        new GetPassengersResponseDto(),
      ];

      jest
        .spyOn(passengersRepository, 'findAndCount')
        .mockResolvedValue([passengersMock, totalPassengers]);
      jest
        .spyOn(PassengerToDtoMapper, 'toGetPassengersResponseDto')
        .mockReturnValue(passengersResponseDtoMock);

      const result = await service.findAll(queryMock);

      expect(passengersRepository.findAndCount).toHaveBeenCalledWith({
        skip: (queryMock.page - 1) * queryMock.limit,
        take: queryMock.limit,
        order: { [queryMock.sortBy]: queryMock.sortOrder },
      });
      expect(
        PassengerToDtoMapper.toGetPassengersResponseDto,
      ).toHaveBeenCalledWith(passengersMock);
      expect(result).toEqual(paginationResponseMock);
    });

    it('should return passengers without sorting when sortBy is not provided', async () => {
      const queryMock: GetPassengersRequestDto = {
        page: 1,
        limit: 10,
      };
      const passengersMock = [new Passenger(), new Passenger()];
      const totalPassengers = 2;
      const passengersResponseDtoMock = [
        new GetPassengersResponseDto(),
        new GetPassengersResponseDto(),
      ];
      const paginationResponseMock = new PaginationResponseDto(
        passengersResponseDtoMock,
        totalPassengers,
        queryMock.page,
        queryMock.limit,
        'passengers',
      );

      jest
        .spyOn(passengersRepository, 'findAndCount')
        .mockResolvedValue([passengersMock, totalPassengers]);
      jest
        .spyOn(PassengerToDtoMapper, 'toGetPassengersResponseDto')
        .mockReturnValue(passengersResponseDtoMock);

      const result = await service.findAll(queryMock);

      expect(passengersRepository.findAndCount).toHaveBeenCalledWith({
        skip: (queryMock.page - 1) * queryMock.limit,
        take: queryMock.limit,
        order: {},
      });
      expect(
        PassengerToDtoMapper.toGetPassengersResponseDto,
      ).toHaveBeenCalledWith(passengersMock);
      expect(result).toEqual(paginationResponseMock);
    });
  });

  describe('passengerExists', () => {
    it('should return true if a passenger exists', async () => {
      const passengerId = 'c9d445d3-bedc-4d4e-8357-1f727c54602a';
      jest
        .spyOn(passengersRepository, 'findOne')
        .mockResolvedValue(new Passenger());

      const exists = await service.passengerExists(passengerId);

      expect(passengersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(passengersRepository.findOne).toHaveBeenCalledWith({
        where: { id: passengerId },
      });
      expect(exists).toBe(true);
    });

    it('should return false if a passenger does not exist', async () => {
      const passengerId = 'a81f7116-67af-477d-9c25-95b6e9c4c3fe';
      jest.spyOn(passengersRepository, 'findOne').mockResolvedValue(undefined);

      const exists = await service.passengerExists(passengerId);

      expect(passengersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(passengersRepository.findOne).toHaveBeenCalledWith({
        where: { id: passengerId },
      });
      expect(exists).toBe(false);
    });
  });
});
