import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '../../enums';

export class GetTripsDriverResponseDto {
  @ApiProperty({
    description: 'Driver ID',
    type: String,
    example: 'd1f6e3ec-1d1b-467e-97c5-8ff5e56f84e4',
  })
  id: string;

  @ApiProperty({
    description: 'Driver Name',
    type: String,
    example: 'John Doe',
  })
  name: string;
}

export class GetTripsPassengerResponseDto {
  @ApiProperty({
    description: 'Passenger ID',
    type: String,
    example: '8dbb4e5d-518e-49fc-a0f4-2b6f34cce36c',
  })
  id: string;

  @ApiProperty({
    description: 'Passenger Name',
    type: String,
    example: 'Jane Smith',
  })
  name: string;
}

export class GetTripsResponseDto {
  @ApiProperty({
    description: 'Trip ID',
    type: String,
    example: 'a1f6e3ec-1d1b-467e-97c5-8ff5e56f84e4',
  })
  id: string;

  @ApiProperty({
    description: 'Driver object with id and name',
    type: GetTripsDriverResponseDto,
  })
  driver: GetTripsDriverResponseDto;

  @ApiProperty({
    description: 'Passenger object with id and name',
    type: GetTripsPassengerResponseDto,
  })
  passenger: GetTripsPassengerResponseDto;

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
  })
  endLatitude: number;

  @ApiProperty({
    description: 'End longitude of the trip',
    type: Number,
    example: -73.935242,
  })
  endLongitude: number;

  @ApiProperty({
    description: 'The current status of the trip',
    enum: TripStatus,
    example: TripStatus.Active,
  })
  status: TripStatus;
}
