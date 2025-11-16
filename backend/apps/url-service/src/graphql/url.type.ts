import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UrlType {
  @Field()
  id: string;

  @Field()
  longUrl: string;

  @Field()
  shortCode: string;

  @Field({ nullable: true })
  customAlias?: string | null;

  @Field({ nullable: true })
  expiresAt?: Date | null;

  @Field()
  createdAt: Date;
}
