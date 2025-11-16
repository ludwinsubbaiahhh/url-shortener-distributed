import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UrlService } from '../url.service';
import { CurrentUser } from './current-user.decorator';
import { UrlType } from './url.type';

@UseGuards(JwtAuthGuard)
@Resolver(() => UrlType)
export class UrlResolver {
  constructor(private readonly urlService: UrlService) {}

  @Query(() => [UrlType])
  async myUrls(@CurrentUser() userId: string) {
    return this.urlService.getUrlsForUser(userId);
  }

  @Mutation(() => Boolean)
  async deleteUrl(
    @Args('shortCode') shortCode: string,
    @CurrentUser() userId: string,
  ): Promise<boolean> {
    await this.urlService.deleteUrl(shortCode, userId);
    return true;
  }
}
