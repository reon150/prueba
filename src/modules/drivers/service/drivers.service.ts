import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { GetDriversResponseDto } from '../dto';
import { GetDriversRequestDto } from '../dto/request/get-drivers-request.dto';

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
}
