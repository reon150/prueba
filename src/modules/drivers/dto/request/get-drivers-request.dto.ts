import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'src/common';

enum DriverSortBy {
  id = 'id',
  name = 'name',
  licenseNumber = 'licenseNumber',
  email = 'email',
  phoneNumber = 'phoneNumber',
  createdAt = 'createdAt',
}

export class GetDriversRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Filter for whether a driver is available',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isAvailable?: boolean; //TODO: Fix this

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: DriverSortBy,
    enumName: 'DriverSortBy',
  })
  @IsEnum(DriverSortBy)
  @IsOptional()
  sortBy?: DriverSortBy;

  @ApiPropertyOptional({
    description: 'Order of sorting',
    default: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
