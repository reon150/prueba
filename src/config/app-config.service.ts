import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  static create(): AppConfigService {
    dotenv.config();
    const configService = new ConfigService();
    return new AppConfigService(configService);
  }

  get appEnv(): string {
    return this.configService.get<string>('APP_ENV');
  }

  get appPort(): number {
    return this.configService.get<number>('APP_PORT');
  }

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT');
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME');
  }

  get baseFare(): number {
    return this.configService.get<number>('FARE_BASE');
  }

  get costPerKm(): number {
    return this.configService.get<number>('FARE_COST_PER_KM');
  }

  get costPerMinute(): number {
    return this.configService.get<number>('FARE_COST_PER_MINUTE');
  }
}
