import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PassengersService } from '../service/passengers.service';
import {
  ApiBadRequestResponse,
  ApiPaginatedResponse,
  PaginationResponseDto,
} from 'src/common';
import { GetPassengersRequestDto, GetPassengersResponseDto } from '../dto';

@ApiTags('passengers')
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

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
    //TODO: Implement a constant pagination limit
    //TODO: Implement DTO mapping
    return this.passengersService.findAll(query);
  }
}
