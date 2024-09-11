import { ApiProperty } from '@nestjs/swagger';

export class GetPassengersResponseDto {
  @ApiProperty({
    example: 'uuid-example-1234',
    description: 'Unique identifier of the passenger',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the passenger' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the passenger',
  })
  email: string;

  @ApiProperty({
    example: '8095551234',
    description: 'Phone number of the passenger',
  })
  phoneNumber: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Timestamp of when the passenger was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00.000Z',
    description: "Timestamp of the last update to the passenger's record",
  })
  updatedAt: Date;
}
