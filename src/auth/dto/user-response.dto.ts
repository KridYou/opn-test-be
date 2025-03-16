import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  age: number;

  @Expose()
  gender: 'male' | 'female' | 'other';

  @Expose()
  address: string;

  @Expose()
  subscribeToNewsletter: boolean;
}
