import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateTripRequestDto, UpdateTripRequestDto } from '../dto';
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip details' })
  async updateTrip(
    @Param('id') id: string,
    @Body() updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<Trip> {
    //TODO: Create response dto
    return this.tripsService.update(id, updateTripRequestDto);
  }
}
