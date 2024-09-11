import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common';
import { Repository } from 'typeorm';
import { Passenger } from '../entities/passenger.entity';
import {
  GetPassengersResponseDto,
  GetPassengersRequestDto,
  GetPassengerResponseDto,
} from '../dto';

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
    //TODO: Add mapper
    return passenger;
  }

  async findAll(
    query: GetPassengersRequestDto,
  ): Promise<PaginationResponseDto<GetPassengersResponseDto>> {
    const [data, total] = await this.passengersRepository.findAndCount({
      skip: (query.page - 1) * query.limit, //TODO: Add limit for limit
      take: query.limit,
      order: query.sortBy ? { [query.sortBy]: query.sortOrder || 'ASC' } : {}, // TODO: Use enum instead of ASC
    });

    const basePath = 'passengers';
    return new PaginationResponseDto(
      data,
      total,
      query.page,
      query.limit,
      basePath,
    );
  }
}
