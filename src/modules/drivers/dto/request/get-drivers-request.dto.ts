import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'src/common';

enum DriverSortByEnum {
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
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => obj.isAvailable === 'true')
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: DriverSortByEnum,
    enumName: 'DriverSortBy',
  })
  @IsEnum(DriverSortByEnum)
  @IsOptional()
  sortBy?: DriverSortByEnum;

  @ApiPropertyOptional({
    description: 'Order of sorting',
    default: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
