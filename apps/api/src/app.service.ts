import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'The Beauty Pro API',
    };
  }

  getVersion() {
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
