import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Welcome to MyAgen API!',
      version: '1.0.0',
    };
  }
}
