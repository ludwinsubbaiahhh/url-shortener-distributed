import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsString()
  longUrl: string;

  @IsOptional()
  @IsString()
  customAlias?: string;
}
