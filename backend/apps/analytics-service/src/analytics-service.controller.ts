import { Controller, Get } from '@nestjs/common';
import { AnalyticsServiceService } from './analytics-service.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(
    private readonly analyticsServiceService: AnalyticsServiceService,
    private readonly prismaService: PrismaService,
    @Inject('URL_SERVICE_QUEUE') private readonly rabbitClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.analyticsServiceService.getHello();
  }

  @EventPattern('url.analytics')
  async handleUrlAnalytics(@Payload() payload: any) {
    try {
      const { urlId, ipAddress, userAgent, referrer, timestamp } = payload || {};

      // Geolocation lookup
      let country: string | undefined;
      let city: string | undefined;
      try {
        if (ipAddress) {
          const geo = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
          country = geo.data?.country_name || geo.data?.country;
          city = geo.data?.city;
        }
      } catch {
        // Ignore geo lookup errors
      }

      // Simple UA parsing
      const device = userAgent?.includes('Mobile') ? 'mobile' : 'desktop';
      const browser = userAgent?.includes('Chrome') ? 'Chrome' : undefined;

      const created = await this.prismaService.analytics.create({
        data: {
          urlId,
          clickedAt: timestamp ? new Date(timestamp) : new Date(),
          ipAddress: ipAddress || 'unknown',
          country: country || null,
          city: city || null,
          device: device || null,
          browser: browser || null,
          referrer: referrer || null,
        },
      });

      // Find shortCode for broadcasting (payload may not include it)
      let shortCode = payload?.shortCode as string | undefined;
      if (!shortCode && urlId) {
        const url = await this.prismaService.url.findUnique({ where: { id: urlId } as any });
        shortCode = url?.shortCode;
      }

      // Emit update event to url-service
      this.rabbitClient.emit('analytics.updated', {
        shortCode,
        urlId,
        clickedAt: created.clickedAt,
        ipAddress: created.ipAddress,
        country: created.country,
        city: created.city,
        device: created.device,
        browser: created.browser,
        referrer: created.referrer,
      });
    } catch (err) {
      // Swallow to avoid crashing consumer; add real logging later
    }
  }
}
