import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseStatus } from '@/shared/domain/status';

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

  @IsOptional()
  @IsEnum(BaseStatus)
  status?: BaseStatus;
}
