import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './service/trips.service';
import { TripsController } from './controller/trips.controller';
import { Trip } from './entities';
import { InvoicesModule } from '../invoices/invoices.module';
import { DriversModule } from '../drivers/drivers.module';
import { PassengersModule } from '../passengers/passengers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip]),
    InvoicesModule,
    DriversModule,
    PassengersModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
  exports: [TripsService],
})
export class TripsModule {}
