import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateTripRequestDto } from '../dto';
import { Trip } from '../entities';
import { TripsService } from '../service/Trips.service';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  async createTrip(
    @Body() createTripRequestDto: CreateTripRequestDto,
  ): Promise<Trip> {
    //TODO: Create response dto
    return this.tripsService.create(createTripRequestDto);
  }
}
