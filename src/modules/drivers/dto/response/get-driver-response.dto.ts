import { ApiProperty } from '@nestjs/swagger';

class GetDriverTripPassengerResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the driver.',
  })
  id: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'Name of the driver.',
  })
  name: string;
}

class GetDriverTripResponseDto {
  @ApiProperty({
    example: '789e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the trip.',
  })
  id: string;

  @ApiProperty({
    type: GetDriverTripPassengerResponseDto,
    description: 'Passenger associated with the trip.',
  })
  passenger: GetDriverTripPassengerResponseDto;

  @ApiProperty({
    example: 40.712776,
    description: 'Latitude coordinate where the trip started.',
  })
  startLatitude: number;

  @ApiProperty({
    example: -74.005974,
    description: 'Longitude coordinate where the trip started.',
  })
  startLongitude: number;

  @ApiProperty({
    example: 40.712776,
    nullable: true,
    description: 'Latitude coordinate where the trip ended, if applicable.',
  })
  endLatitude: number;

  @ApiProperty({
    example: -74.005974,
    nullable: true,
    description: 'Longitude coordinate where the trip ended, if applicable.',
  })
  endLongitude: number;

  @ApiProperty({
    example: '2020-01-01T00:00:00Z',
    nullable: true,
    description: 'The start time of the trip.',
  })
  startTime: Date;

  @ApiProperty({
    example: '2020-01-01T02:00:00Z',
    nullable: true,
    description: 'The end time of the trip, if the trip has concluded.',
  })
  endTime: Date;
}

export class GetDriverResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'DL1234567890' })
  licenseNumber: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiProperty({ example: 40.712776 })
  locationLatitude: number;

  @ApiProperty({ example: -74.005974 })
  locationLongitude: number;

  @ApiProperty({ type: [GetDriverTripResponseDto] })
  trips: GetDriverTripResponseDto[];
}
