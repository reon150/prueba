import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateTripRequestDto } from './create-trip-request.dto';
import { TripStatus } from '../../enums';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTripRequestDto extends PartialType(
  OmitType(CreateTripRequestDto, ['driverId', 'passengerId']),
) {
  @ApiProperty({
    description: 'The current status of the trip',
    enum: TripStatus,
    example: TripStatus.Active,
  })
  @IsEnum(TripStatus)
  status: TripStatus;

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
    description: 'End time of the trip',
    type: String,
    format: 'date-time',
    required: false,
    example: '2024-09-13T09:15:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;
}
