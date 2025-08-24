import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTodoListDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
