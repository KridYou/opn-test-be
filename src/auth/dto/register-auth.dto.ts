import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class RegisterUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @Type(() => Date)
  @IsDate({ message: 'Invalid date format' })
  dateOfBirth: Date;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, { message: 'Gender must be male, female, or other' })
  gender: Gender;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: 'Subscribe to newsletter must be a boolean' })
  subscribeToNewsletter?: boolean;
}
