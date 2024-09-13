import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './service/Invoices.service';
import { Invoice } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
