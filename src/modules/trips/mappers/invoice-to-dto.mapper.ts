import { Invoice } from 'src/modules/invoices/entities';
import { GetInvoiceResponseDto } from '../dto';

export class InvoiceToDtoMapper {
  static toGetInvoiceResponseDto(invoice: Invoice): GetInvoiceResponseDto {
    return {
      id: invoice.id,
      tripId: invoice.tripId,
      amount: invoice.amount,
      paymentStatus: invoice.paymentStatus,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(), // Assuming updatedAt is a Date object
    };
  }
}
