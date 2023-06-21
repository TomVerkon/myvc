import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base-dto';

export class UpdateUserDto extends BaseDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
