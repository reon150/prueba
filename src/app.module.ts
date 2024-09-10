import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './config';
import { DriversModule } from './modules/drivers/drivers.module';
import { PassengersModule } from './modules/passengers/passengers.module';
import { TripsModule } from './modules/trips/trips.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ormConfig } from 'ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig),
    DriversModule,
    PassengersModule,
    TripsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
