import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './service/Trips.service';
import { TripsController } from './controller/Trips.controller';
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
