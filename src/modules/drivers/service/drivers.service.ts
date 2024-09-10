import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driversRepository: Repository<Driver>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationResponseDto<Driver>> {
    const [data, total] = await this.driversRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const basePath = 'drivers';
    return new PaginationResponseDto(data, total, page, limit, basePath);
  }
}
