import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DriversService } from '../service/drivers.service';

import {
  GetDriverResponseDto,
  GetDriversRequestDto,
  GetDriversResponseDto,
  GetNearbyDriversRequestDto,
  GetNearbyDriversResponseDto,
} from '../dto';
import {
  ApiBadRequestResponse,
  ApiPaginatedResponse,
  PaginationResponseDto,
  UUIDValidationPipe,
} from '../../../common';

@ApiTags('drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('/nearby')
  @ApiOperation({
    summary: 'Retrieve a list of nearby drivers',
    description:
      'Returns a list of drivers sorted by proximity to the provided latitude and longitude.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of nearby drivers',
    type: GetNearbyDriversResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse()
  async findNearby(
    @Query() query: GetNearbyDriversRequestDto,
  ): Promise<GetNearbyDriversResponseDto[]> {
    return this.driversService.findNearby(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific driver',
    description:
      'Retrieves detailed information about a specific driver, including all associated trips.',
  })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  async findOne(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<GetDriverResponseDto> {
    return this.driversService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of drivers',
    description:
      'Returns a paginated list of drivers, optionally filtered by their availability.',
  })
  @ApiPaginatedResponse(GetDriversResponseDto)
  @ApiBadRequestResponse()
  async findAll(
    @Query() query: GetDriversRequestDto,
  ): Promise<PaginationResponseDto<GetDriversResponseDto>> {
    return this.driversService.findAll(query);
  }
}
