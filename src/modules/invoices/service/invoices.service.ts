import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../enums';
import { Invoice } from '../entities';
import { Trip } from 'src/modules/trips/entities';
import { calculateAngularDistance } from 'src/common';
import { AppConfigService } from 'src/config';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly appConfigService: AppConfigService,
  ) {}

  findOneByTripId = async (tripId: string): Promise<Invoice | undefined> => {
    return await this.invoiceRepository.findOne({ where: { tripId } });
  };

  create = async (trip: Trip): Promise<Invoice> => {
    const amount = this.calculateTripAmount(trip);

    const invoice = this.invoiceRepository.create({
      tripId: trip.id,
      amount,
      paymentStatus: PaymentStatus.Processing,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    this.processInvoice(savedInvoice);

    return savedInvoice;
  };

  private calculateTripAmount = (trip: Trip): number => {
    const baseFare = this.appConfigService.baseFare;
    const costPerKm = this.appConfigService.costPerKm;
    const costPerMinute = this.appConfigService.costPerMinute;

    const distance = calculateAngularDistance(
      trip.startLatitude,
      trip.startLongitude,
      trip.endLatitude,
      trip.endLongitude,
    );

    const durationInMinutes =
      (trip.endTime.getTime() - trip.startTime.getTime()) / 1000 / 60;

    const amount =
      baseFare + distance * costPerKm + durationInMinutes * costPerMinute;

    return amount;
  };

  // Simulate proccessing
  private processInvoice = async (invoice: Invoice): Promise<void> => {
    const delay = Math.random() * 5000 + 5000; // 5 to 10 seconds delay
    setTimeout(async () => {
      const random = Math.random();
      invoice.paymentStatus =
        random > 0.9 ? PaymentStatus.Unpaid : PaymentStatus.Paid; // 10% chance for unpaid
      await this.invoiceRepository.save(invoice);
    }, delay);
  };
}
