import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationAndSortRequestDto } from 'src/common';

export class GetDriversRequestDto extends PaginationAndSortRequestDto {
  @ApiPropertyOptional({
    description: 'Filter for whether a driver is available',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
