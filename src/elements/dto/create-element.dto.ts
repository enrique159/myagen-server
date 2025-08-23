import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateElementDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  assignedDate: Date;
}
