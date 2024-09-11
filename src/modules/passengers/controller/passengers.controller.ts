import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { PassengersService } from '../service/passengers.service';
import { ApiPaginatedResponse, PaginationResponseDto } from 'src/common';
import {
  GetPassengerResponseDto,
  GetPassengersRequestDto,
  GetPassengersResponseDto,
} from '../dto';

@ApiTags('passengers')
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single passenger',
    description:
      'Returns a single passenger along with associated trip details.',
  })
  @ApiResponse({
    status: 200,
    description: 'The passenger data with associated trips',
    type: GetPassengerResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid ID supplied' })
  @ApiResponse({ status: 404, description: 'Passenger not found' })
  async findOne(@Param('id') id: string): Promise<GetPassengerResponseDto> {
    return this.passengersService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of passengers',
    description:
      'Returns a paginated list of passengers, optionally filtered by criteria.',
  })
  @ApiQuery({
    type: GetPassengersRequestDto,
    name: 'query',
    required: false,
    description: 'Query parameters for filtering and pagination',
  })
  @ApiPaginatedResponse(GetPassengersResponseDto)
  @ApiBadRequestResponse()
  async findAll(
    @Query() query: GetPassengersRequestDto,
  ): Promise<PaginationResponseDto<GetPassengersResponseDto>> {
    return this.passengersService.findAll(query);
  }
}
