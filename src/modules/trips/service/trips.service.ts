import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTripRequestDto,
  GetTripsRequestDto,
  GetTripsResponseDto,
  UpdateTripRequestDto,
} from '../dto';
import { Trip } from '../entities';
import { PaginationResponseDto } from 'src/common';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
  ) {}

  async findAll(
    query: GetTripsRequestDto,
  ): Promise<PaginationResponseDto<GetTripsResponseDto>> {
    const { driverId, passengerId, status, page, limit } = query;

    const qb = this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.passenger', 'passenger');

    if (driverId) {
      qb.andWhere('trip.driverId = :driverId', { driverId });
    }

    if (passengerId) {
      qb.andWhere('trip.passengerId = :passengerId', { passengerId });
    }

    if (status) {
      qb.andWhere('trip.status = :status', { status });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [trips, total] = await qb.getManyAndCount();

    const data = trips.map((trip) => ({
      id: trip.id,
      driver: {
        id: trip.driver.id,
        name: trip.driver.name,
      },
      passenger: {
        id: trip.passenger.id,
        name: trip.passenger.name,
      },
      startLatitude: trip.startLatitude,
      startLongitude: trip.startLongitude,
      endLatitude: trip.endLatitude,
      endLongitude: trip.endLongitude,
      status: trip.status,
    }));

    const basePath = 'trips';
    return new PaginationResponseDto(
      data,
      total,
      query.page,
      query.limit,
      basePath,
    );
  }

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
