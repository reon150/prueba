import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  get appEnv(): string {
    return this.getEnvVariable('APP_ENV');
  }

  get appPort(): number {
    return parseInt(this.getEnvVariable('APP_PORT'), 10);
  }

  get dbUrl(): string {
    return this.getEnvVariable('DB_URL');
  }

  private getEnvVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not defined.`);
    }
    return value;
  }
}
