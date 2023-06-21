import { IsEmail, IsString } from 'class-validator';
import { BaseDto } from './base-dto';

export class CreateUserDto extends BaseDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
