import { IsEmail, IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: 'male' | 'female' | 'other';

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  subscribeToNewsletter?: boolean;
}
