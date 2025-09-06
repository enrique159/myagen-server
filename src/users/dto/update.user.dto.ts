import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsStrongPassword()
  readonly password?: string;
}
