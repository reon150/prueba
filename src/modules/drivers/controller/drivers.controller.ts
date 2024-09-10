import { Controller, Get, Query } from '@nestjs/common';
import { DriversService } from '../service/drivers.service';
import { Driver } from '../entities';
import { PaginationResponseDto } from 'src/common';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationResponseDto<Driver>> {
    //TODO: Add a constant limit for eveything
    return this.driversService.findAll(page, limit);
  }
}
