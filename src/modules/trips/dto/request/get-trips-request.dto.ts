import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { TripStatus } from '../../enums';

export class GetTripsRequestDto {
  @ApiPropertyOptional({
    description: 'Filter by driver ID',
    type: String,
    example: 'd1f6e3ec-1d1b-467e-97c5-8ff5e56f84e4',
  })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({
    description: 'Filter by passenger ID',
    type: String,
    example: '8dbb4e5d-518e-49fc-a0f4-2b6f34cce36c',
  })
  @IsOptional()
  @IsUUID()
  passengerId?: string;

  @ApiPropertyOptional({
    description: 'Filter by trip status',
    enum: TripStatus,
    example: TripStatus.Active,
  })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Limit of items per page',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
