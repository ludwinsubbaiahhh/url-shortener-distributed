import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class DynamicThrottlerGuard extends ThrottlerGuard {
  /**
   * Override getTracker to return the request's IP address
   */
  protected getTracker(req: Record<string, any>): string {
    return req.ip;
  }

  /**
   * Override handleRequest to apply different throttler sets based on authentication
   */
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: string,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if user is authenticated
    const isAuthenticated = !!request.user;
    
    // Apply different throttler sets based on authentication status
    const throttlerName = isAuthenticated ? 'authenticated' : 'anonymous';
    
    // Get the throttler configuration for the appropriate set
    const throttlerConfig = this.options.throttlers.find(t => t.name === throttlerName);
    
    if (!throttlerConfig) {
      throw new ThrottlerException('Throttler configuration not found');
    }

    // Use the appropriate limit and TTL for the user's authentication status
    const effectiveLimit = throttlerConfig.limit;
    const effectiveTtl = throttlerConfig.ttl;

    // Call the parent method with the effective limits
    return super.handleRequest(context, effectiveLimit, effectiveTtl, throttlerName);
  }
}
