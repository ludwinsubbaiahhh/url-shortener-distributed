import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsType {
  @Field()
  id: string;

  @Field()
  clickedAt: Date;

  @Field({ nullable: true })
  ipAddress?: string | null;

  @Field({ nullable: true })
  country?: string | null;

  @Field({ nullable: true })
  city?: string | null;

  @Field({ nullable: true })
  device?: string | null;

  @Field({ nullable: true })
  browser?: string | null;

  @Field({ nullable: true })
  referrer?: string | null;
}


