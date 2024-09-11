import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripRequestDto } from '../dto';
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
}
