import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateElementDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  assignedDate?: Date;
}
