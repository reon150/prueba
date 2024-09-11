import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripRequestDto, UpdateTripRequestDto } from '../dto';
import { Trip } from '../entities';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(createTripRequestDto: CreateTripRequestDto): Promise<Trip> {
    const trip = this.tripRepository.create(createTripRequestDto);

    return this.tripRepository.save(trip);
  }

  async update(
    id: string,
    updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    // TODO: Add documentation for NotFoundException

    Object.assign(trip, updateTripRequestDto);

    return this.tripRepository.save(trip);
  }
}
