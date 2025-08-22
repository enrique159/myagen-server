import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { IsEmailUnique } from '../validators/is-email-unique.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsEmailUnique()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly lastName: string;
}
