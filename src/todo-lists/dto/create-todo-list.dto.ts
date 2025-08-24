import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TodoListType } from '../todo-list.entity';

export class CreateTodoListDto {
  @IsNotEmpty()
  @IsUUID()
  elementId: string;

  @IsNotEmpty()
  @IsEnum(TodoListType)
  type: TodoListType;

  @IsOptional()
  @IsNumber()
  order?: number;
}
