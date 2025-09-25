import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';
import { FilesService } from '@/files/files.service';
import { FilesModule } from '@/files/files.module';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), FilesModule],
  exports: [TypeOrmModule],
  providers: [UsersService, IsEmailUniqueConstraint, FilesService],
})
export class UsersModule {}
