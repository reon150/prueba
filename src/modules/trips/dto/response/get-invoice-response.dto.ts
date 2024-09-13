import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../../invoices/enums';

export class GetInvoiceResponseDto {
  @ApiProperty({
    description: 'ID of the invoice',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the trip associated with the invoice',
    type: String,
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-1234567890ab',
  })
  tripId: string;

  @ApiProperty({
    description: 'Total amount charged for the trip',
    type: Number,
    example: 50.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Current payment status of the invoice',
    enum: PaymentStatus,
    example: PaymentStatus.Paid,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Timestamp when the invoice was created',
    type: String,
    example: '2024-09-11T15:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when the invoice was last updated',
    type: String,
    example: '2024-09-11T17:45:00.000Z',
  })
  updatedAt: string;
}
