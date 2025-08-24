import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  listId: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
