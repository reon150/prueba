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
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CreateTripRequestDto,
  GetTripsRequestDto,
  GetTripsResponseDto,
  UpdateTripRequestDto,
  UpdateTripResponseDto,
} from '../dto';
import { TripsService } from '../service/Trips.service';
import {
  ApiPaginatedResponse,
  PaginationResponseDto,
  UUIDValidationPipe,
} from 'src/common';

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
  @ApiPaginatedResponse(GetTripsResponseDto)
  @ApiBadRequestResponse()
  async findAll(
    @Query() query: GetTripsRequestDto,
  ): Promise<PaginationResponseDto<GetTripsResponseDto>> {
    return this.tripsService.findAll(query);
  }

  //TODO: Add documentation for swagger
  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  async createTrip(
    @Body() createTripRequestDto: CreateTripRequestDto,
  ): Promise<CreateTripRequestDto> {
    return this.tripsService.create(createTripRequestDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip details' })
  @ApiNotFoundResponse({ description: 'Trip not found' })
  async updateTrip(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<UpdateTripResponseDto> {
    return this.tripsService.update(id, updateTripRequestDto);
  }
}
