import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsType {
  @Field()
  id: string;

  @Field()
  clickedAt: Date;

  @Field(() => String, { nullable: true })
  ipAddress?: string | null;

  @Field(() => String, { nullable: true })
  country?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  device?: string | null;

  @Field(() => String, { nullable: true })
  browser?: string | null;

  @Field(() => String, { nullable: true })
  referrer?: string | null;
}


