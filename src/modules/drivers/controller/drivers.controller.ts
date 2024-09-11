import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DriversService } from '../service/drivers.service';
import { ApiPaginatedResponse, PaginationResponseDto } from 'src/common';
import { GetDriversRequestDto, GetDriversResponseDto } from '../dto';

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
  @ApiQuery({
    type: GetDriversRequestDto,
    name: 'query',
    required: false,
    description: 'Query parameters for filtering and pagination',
  })
  @ApiPaginatedResponse(GetDriversResponseDto)
  async findAll(
    @Query() query: GetDriversRequestDto,
  ): Promise<PaginationResponseDto<GetDriversResponseDto>> {
    //TODO: Add a constant limit for eveything
    return this.driversService.findAll(query);
  }
}
