import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlServiceService } from './url-service.service';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlServiceController {
  constructor(
    private readonly urlServiceService: UrlServiceService,
    private readonly urlService: UrlService,
  ) {}

  @Get()
  getHello(): string {
    return this.urlServiceService.getHello();
  }

  @Post('api/shorten')
  async shortenUrl(@Body() dto: CreateUrlDto) {
    return await this.urlService.shortenUrl(dto.longUrl, undefined, dto.customAlias);
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const longUrl = await this.urlService.getLongUrl(shortCode, req);
      res.redirect(302, longUrl);
    } catch (error) {
      res.status(404).send('Not Found');
    }
  }
}
