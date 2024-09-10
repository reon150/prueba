import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoicesTable1725987933066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE invoices (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          trip_id UUID REFERENCES trips(id),
          amount DECIMAL,
          payment_status VARCHAR CHECK (payment_status IN ('paid', 'unpaid')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS invoices`);
  }
}
