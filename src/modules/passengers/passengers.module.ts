import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersService } from './service/passengers.service';
import { Passenger } from './entities';
import { PassengersController } from './controller/passengers.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  providers: [PassengersService],
  controllers: [PassengersController],
  exports: [PassengersService],
})
export class PassengersModule {}
