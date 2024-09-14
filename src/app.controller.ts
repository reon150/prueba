import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Check health status of the service',
    description:
      'This endpoint is used to confirm the service is operational and returns a specific greeting message as a sign of life.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is up and running',
    schema: {
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
