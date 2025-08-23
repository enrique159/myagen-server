import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;
}
