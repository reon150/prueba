import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { TripStatus } from '../../enums';

export class CreateTripRequestDto {
  @ApiProperty({
    description: 'UUID of the driver assigned to the trip',
    type: String,
    example: 'd1f6e3ec-1d1b-467e-97c5-8ff5e56f84e4',
  })
  @IsUUID()
  driverId: string;

  @ApiProperty({
    description: 'UUID of the passenger assigned to the trip',
    type: String,
    example: '8dbb4e5d-518e-49fc-a0f4-2b6f34cce36c',
  })
  @IsUUID()
  passengerId: string;

  @ApiProperty({
    description: 'Start latitude of the trip',
    type: Number,
    example: 40.712776,
  })
  @IsNumber()
  startLatitude: number;

  @ApiProperty({
    description: 'Start longitude of the trip',
    type: Number,
    example: -74.005974,
  })
  @IsNumber()
  startLongitude: number;

  @ApiProperty({
    description: 'End latitude of the trip',
    type: Number,
    example: 40.73061,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  endLatitude?: number;

  @ApiProperty({
    description: 'End longitude of the trip',
    type: Number,
    example: -73.935242,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  endLongitude?: number;

  @ApiProperty({
    description: 'The current status of the trip',
    enum: TripStatus,
    example: TripStatus.Active,
  })
  @IsEnum(TripStatus)
  status: TripStatus;
}
