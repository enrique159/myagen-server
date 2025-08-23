import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTodoListDto {
  @IsNotEmpty()
  @IsUUID()
  elementId: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
