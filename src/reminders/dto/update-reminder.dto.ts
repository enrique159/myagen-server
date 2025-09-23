import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  reminderDate?: string;

  @IsOptional()
  @IsBoolean()
  notified?: boolean;
}
