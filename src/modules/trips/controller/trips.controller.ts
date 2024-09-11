import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  CreateTripRequestDto,
  GetTripsRequestDto,
  GetTripsResponseDto,
  UpdateTripRequestDto,
} from '../dto';
import { Trip } from '../entities';
import { TripsService } from '../service/Trips.service';
import { ApiPaginatedResponse, PaginationResponseDto } from 'src/common';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of trips',
    description:
      'Returns a paginated list of trips, optionally filtered by status, driver, or passenger.',
  })
  @ApiQuery({
    type: GetTripsRequestDto,
    name: 'query',
    required: false,
    description: 'Query parameters for filtering and pagination',
  })
  @ApiPaginatedResponse(GetTripsResponseDto)
  @ApiBadRequestResponse()
  async findAll(
    @Query() query: GetTripsRequestDto,
  ): Promise<PaginationResponseDto<GetTripsResponseDto>> {
    //TODO: Add a constant limit for pagination
    //TODO: Add mapper for DTOs
    return this.tripsService.findAll(query);
  }

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
