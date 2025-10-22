import { Controller, Get } from '@nestjs/common';
import { UrlServiceService } from './url-service.service';

@Controller()
export class UrlServiceController {
  constructor(private readonly urlServiceService: UrlServiceService) {}

  @Get()
  getHello(): string {
    return this.urlServiceService.getHello();
  }
}
