import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

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
    description: 'Start time of the trip',
    type: String,
    format: 'date-time',
    example: '2024-09-13T08:45:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startTime: Date;
}
