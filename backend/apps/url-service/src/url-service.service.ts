import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
