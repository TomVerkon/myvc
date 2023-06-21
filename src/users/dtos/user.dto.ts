import { Expose } from 'class-transformer';
import { BaseDto } from './base-dto';

export class UserDto extends BaseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
