import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string; // For first-time login (auto-create user)
}
