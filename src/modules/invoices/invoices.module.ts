import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './service/Invoices.service';
import { Invoice } from './entities';
import { AppConfigService } from '../../config';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [InvoicesService, AppConfigService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
