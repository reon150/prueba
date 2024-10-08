import { ApiProperty } from '@nestjs/swagger';

class GetPassengerTripDriverResponseDto {
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

class GetPassengerTripResponseDto {
  @ApiProperty({
    example: '789e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the trip.',
  })
  id: string;

  @ApiProperty({
    type: GetPassengerTripDriverResponseDto,
    description: 'Driver associated with the trip.',
  })
  driver: GetPassengerTripDriverResponseDto;

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

export class GetPassengerResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the passenger.',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the passenger.',
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the passenger.',
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number of the passenger.',
  })
  phoneNumber: string;

  @ApiProperty({
    type: [GetPassengerTripResponseDto],
    description: 'List of trips associated with the passenger.',
  })
  trips: GetPassengerTripResponseDto[];
}
