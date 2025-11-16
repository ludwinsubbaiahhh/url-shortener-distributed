import { Controller, Get, Post, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlServiceService } from './url-service.service';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('api/shorten')
  async shortenUrl(@Body() dto: CreateUrlDto, @Req() req: Request) {
    const userId = (req as any).user?.id ?? (req as any).user?.['id'];
    return await this.urlService.shortenUrl(dto.longUrl, userId, dto.customAlias);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/urls')
  async getUserUrls(@Req() req: Request) {
    const userId = (req as any).user?.id ?? (req as any).user?.['id'];
    return this.urlService.getUrlsForUser(userId);
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
