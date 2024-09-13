import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from '../entities/passenger.entity';
import {
  GetPassengersResponseDto,
  GetPassengersRequestDto,
  GetPassengerResponseDto,
} from '../dto';
import { PassengerToDtoMapper } from '../mappers';
import {
  getLimitValue,
  PaginationResponseDto,
  SortOrder,
} from '../../../common';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengersRepository: Repository<Passenger>,
  ) {}

  async findOne(id: string): Promise<GetPassengerResponseDto> {
    const passenger = await this.passengersRepository.findOne({
      where: { id: id },
      relations: ['trips', 'trips.driver'],
    });

    if (!passenger) {
      throw new NotFoundException(`Passenger not found with ID: ${id}`);
    }

    return PassengerToDtoMapper.toGetPassengerResponseDto(passenger);
  }

  async findAll(
    query: GetPassengersRequestDto,
  ): Promise<PaginationResponseDto<GetPassengersResponseDto>> {
    query.limit = getLimitValue(query.limit);

    const [data, total] = await this.passengersRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: query.sortBy
        ? { [query.sortBy]: query.sortOrder || SortOrder.ASC }
        : {},
    });

    const basePath = 'passengers';
    const passengers = PassengerToDtoMapper.toGetPassengersResponseDto(data);

    return new PaginationResponseDto(
      passengers,
      total,
      query.page,
      query.limit,
      basePath,
    );
  }

  async passengerExists(id: string): Promise<boolean> {
    const passenger = await this.passengersRepository.findOne({
      where: { id },
    });
    return !!passenger;
  }
}
