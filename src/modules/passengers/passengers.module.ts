import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersService } from './service/Passengers.service';
import { PassengersController } from './controller/Passengers.controller';
import { Passenger } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  providers: [PassengersService],
  controllers: [PassengersController],
  exports: [PassengersService],
})
export class PassengersModule {}
