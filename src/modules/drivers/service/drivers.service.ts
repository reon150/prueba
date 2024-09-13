import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getLimitValue, PaginationResponseDto } from 'src/common';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import {
  GetDriversRequestDto,
  GetDriversResponseDto,
  GetNearbyDriversRequestDto,
  GetNearbyDriversResponseDto,
} from '../dto';
import { DriverToDtoMapper } from '../mappers';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driversRepository: Repository<Driver>,
  ) {}

  async findAll(
    query: GetDriversRequestDto,
  ): Promise<PaginationResponseDto<GetDriversResponseDto>> {
    query.limit = getLimitValue(query.limit);

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      where: {} as any,
      order: query.sortBy ? { [query.sortBy]: query.sortOrder || 'ASC' } : {},
    };

    if (query.isAvailable !== undefined) {
      findOptions.where.isAvailable = query.isAvailable;
    }

    const [data, total] =
      await this.driversRepository.findAndCount(findOptions);

    const basePath = 'drivers';
    const drivers = DriverToDtoMapper.toGetDriversResponseDto(data);

    return new PaginationResponseDto(
      drivers,
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

    return DriverToDtoMapper.toGetNearbyDriversResponseDto(drivers);
  }
}
