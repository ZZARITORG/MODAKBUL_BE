import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller({ version: '0' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '[Health Check] 토큰 검증' })
  @ApiBearerAuth()
  @Get('/health')
  getHello() {
    return;
  }
}
