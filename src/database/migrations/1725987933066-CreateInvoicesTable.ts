import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoicesTable1725987933066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "payment_status_enum" AS ENUM('paid', 'processing', 'unpaid')`,
    );

    await queryRunner.query(`
      CREATE TABLE invoices (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          trip_id UUID REFERENCES trips(id) NOT NULL,
          amount DECIMAL NOT NULL,
          payment_status "payment_status_enum" NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS invoices`);
  }
}
