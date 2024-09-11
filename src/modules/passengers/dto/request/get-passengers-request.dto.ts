import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common';

export enum PassengerSortBy {
  name = 'name',
  email = 'email',
  createdAt = 'createdAt',
}

//TODO: Put SortOrder enum in common
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetPassengersRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    example: PassengerSortBy.name,
    enum: PassengerSortBy,
  })
  @IsOptional()
  @IsEnum(PassengerSortBy)
  sortBy?: PassengerSortBy;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: SortOrder.ASC,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
