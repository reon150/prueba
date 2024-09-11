import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import {
  GetDriversRequestDto,
  GetDriversResponseDto,
  GetNearbyDriversRequestDto,
  GetNearbyDriversResponseDto,
} from '../dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driversRepository: Repository<Driver>,
  ) {}

  async findAll(
    query: GetDriversRequestDto,
  ): Promise<PaginationResponseDto<GetDriversResponseDto>> {
    const [data, total] = await this.driversRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: query.sortBy ? { [query.sortBy]: query.sortOrder || 'ASC' } : {},
    });

    const basePath = 'drivers';
    return new PaginationResponseDto(
      data,
      total,
      query.page,
      query.limit,
      basePath,
    );
  }

  async findNearby(
    query: GetNearbyDriversRequestDto,
  ): Promise<GetNearbyDriversResponseDto[]> {
    const { latitude, longitude, radius, count } = query;

    const queryBuilder = this.driversRepository.createQueryBuilder('driver');

    queryBuilder.select([
      'driver.id AS id',
      'driver.name AS name',
      'driver.license_number AS licenseNumber',
      'driver.phone_number AS phoneNumber',
      'driver.location_latitude AS locationLatitude',
      'driver.location_longitude AS locationLongitude',
    ]);

    // Haversine Formula to calculate the distance between two points on the Earth
    queryBuilder
      .addSelect(
        `
      (6371 * 2 * ASIN(SQRT(
          POWER(SIN((:latitude - ABS(driver.location_latitude)) * PI() / 360), 2) +
          COS(:latitude * PI() / 180) * COS(ABS(driver.location_latitude) * PI() / 180) *
          POWER(SIN((:longitude - driver.location_longitude) * PI() / 360), 2)
      )))`,
        'distance',
      )
      .where('driver.is_available = true')
      .orderBy('distance', 'ASC');

    queryBuilder.setParameters({ latitude, longitude, radius });

    //TODO: Remove this repetition when I have more time
    if (radius !== undefined) {
      queryBuilder.andWhere(
        `
          (6371 * 2 * ASIN(SQRT(
              POWER(SIN((:latitude - ABS(driver.location_latitude)) * PI() / 360), 2) +
              COS(:latitude * PI() / 180) * COS(ABS(driver.location_latitude) * PI() / 180) *
              POWER(SIN((:longitude - driver.location_longitude) * PI() / 360), 2)
          ))) <= :radius`,
        { latitude, longitude, radius },
      );
    }

    if (count !== undefined) {
      queryBuilder.limit(count);
    }

    const drivers = await queryBuilder.getRawMany();

    // TODO: Usea a mapper
    return drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phoneNumber: driver.phoneNumber,
      locationLatitude: driver.locationLatitude,
      locationLongitude: driver.locationLongitude,
      distance: driver.distance,
    }));
  }
}
