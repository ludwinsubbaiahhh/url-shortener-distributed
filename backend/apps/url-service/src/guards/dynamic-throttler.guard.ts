import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class DynamicThrottlerGuard extends ThrottlerGuard {
  /**
   * Override getTracker to return the request's IP address
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
}
