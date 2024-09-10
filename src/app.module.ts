import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config';
import { DriversService } from './modules/drivers/service/drivers.service';
import { DriversController } from './modules/drivers/controller/drivers.controller';
import { PassengersService } from './modules/passengers/service/passengers.service';
import { PassengersController } from './modules/passengers/controller/passengers.controller';
import { TripsService } from './modules/trips/service/trips.service';
import { TripsController } from './modules/trips/controller/trips.controller';
import { InvoicesService } from './modules/invoices/service/invoices.service';
import { InvoicesController } from './modules/invoices/controller/invoices.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    DriversController,
    PassengersController,
    TripsController,
    InvoicesController,
  ],
  providers: [
    AppService,
    AppConfigService,
    DriversService,
    PassengersService,
    TripsService,
    InvoicesService,
  ],
  exports: [AppConfigService],
})
export class AppModule {}
