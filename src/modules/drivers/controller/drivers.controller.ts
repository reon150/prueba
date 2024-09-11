import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DriversService } from '../service/drivers.service';
import {
  ApiBadRequestResponse,
  ApiPaginatedResponse,
  PaginationResponseDto,
} from 'src/common';
import {
  GetDriversRequestDto,
  GetDriversResponseDto,
  GetNearbyDriversRequestDto,
  GetNearbyDriversResponseDto,
} from '../dto';

@ApiTags('drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

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
    //TODO: Add a constant limit for eveything
    //TODO: Add mapper for DTOs
    return this.driversService.findAll(query);
  }

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
}
