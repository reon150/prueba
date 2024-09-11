import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '../../enums';

export class CreateTripResponseDto {
  @ApiProperty({
    description: 'UUID of the updated trip',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'UUID of the driver assigned to the trip',
    type: String,
    example: 'd1f6e3ec-1d1b-467e-97c5-8ff5e56f84e4',
  })
  driverId: string;

  @ApiProperty({
    description: 'UUID of the passenger assigned to the trip',
    type: String,
    example: '8dbb4e5d-518e-49fc-a0f4-2b6f34cce36c',
  })
  passengerId: string;

  @ApiProperty({
    description: 'Start latitude of the trip',
    type: Number,
    example: 40.712776,
  })
  startLatitude: number;

  @ApiProperty({
    description: 'Start longitude of the trip',
    type: Number,
    example: -74.005974,
  })
  startLongitude: number;

  @ApiProperty({
    description: 'End latitude of the trip',
    type: Number,
    example: 40.73061,
    required: false,
  })
  endLatitude?: number;

  @ApiProperty({
    description: 'End longitude of the trip',
    type: Number,
    example: -73.935242,
    required: false,
  })
  endLongitude?: number;

  @ApiProperty({
    description: 'The current status of the trip',
    enum: TripStatus,
    example: TripStatus.Active,
  })
  status: TripStatus;

  @ApiProperty({
    description: 'Timestamp when the trip was created',
    type: String,
    example: '2024-09-11T15:30:00.000Z',
  })
  createdAt: string;
}
