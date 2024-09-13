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
  ApiConflictResponse,
} from '@nestjs/swagger';
import {
  CreateTripRequestDto,
  GetInvoiceResponseDto,
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

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  async create(
    @Body() createTripRequestDto: CreateTripRequestDto,
  ): Promise<CreateTripRequestDto> {
    return this.tripsService.create(createTripRequestDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip details' })
  @ApiNotFoundResponse({ description: 'Trip not found' })
  @ApiConflictResponse({ description: 'Cannot modify a completed trip' })
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTripRequestDto: UpdateTripRequestDto,
  ): Promise<UpdateTripResponseDto> {
    return this.tripsService.update(id, updateTripRequestDto);
  }

  @Get(':tripId/invoice')
  @ApiOperation({
    summary: 'Retrieve an invoice by trip ID',
    description: 'Fetches the invoice associated with the given trip ID.',
  })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async getInvoiceByTripId(
    @Param('tripId', UUIDValidationPipe) tripId: string,
  ): Promise<GetInvoiceResponseDto> {
    return this.tripsService.findInvoiceByTripId(tripId);
  }
}
