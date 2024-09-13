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
    return this.getConfig('APP_ENV');
  }

  get appPort(): number {
    return parseInt(this.getConfig('APP_PORT'));
  }

  get dbHost(): string {
    return this.getConfig('DB_HOST');
  }

  get dbPort(): number {
    return parseInt(this.getConfig('DB_PORT'));
  }

  get dbUsername(): string {
    return this.getConfig('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.getConfig('DB_PASSWORD');
  }

  get dbName(): string {
    return this.getConfig('DB_NAME');
  }

  get baseFare(): number {
    return parseFloat(this.getConfig('FARE_BASE'));
  }

  get costPerKm(): number {
    return parseFloat(this.getConfig('FARE_COST_PER_KM'));
  }

  get costPerMinute(): number {
    return parseFloat(this.getConfig('FARE_COST_PER_MINUTE'));
  }

  private getConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (value === undefined) {
      throw new Error(
        `Configuration for ${key} is required but was not found.`,
      );
    }
    return value;
  }
}
