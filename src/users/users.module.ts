import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [UsersService, IsEmailUniqueConstraint],
})
export class UsersModule {}
