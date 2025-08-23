import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateElementDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  assignedDate: Date;
}
