import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '../../../../common';

export enum GetDriversRequestSortByDto {
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
    enum: GetDriversRequestSortByDto,
    enumName: 'GetDriversRequestSortByDto',
  })
  @IsEnum(GetDriversRequestSortByDto)
  @IsOptional()
  sortBy?: GetDriversRequestSortByDto;

  @ApiPropertyOptional({
    description: 'Order of sorting',
    default: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
