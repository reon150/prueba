import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './service/Trips.service';
import { TripsController } from './controller/Trips.controller';
import { Trip } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  providers: [TripsService],
  controllers: [TripsController],
  exports: [TripsService],
})
export class TripsModule {}
