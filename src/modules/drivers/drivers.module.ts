import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities';
import { DriversService } from './service/drivers.service';
import { DriversController } from './controller/drivers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}
