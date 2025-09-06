import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { UserToken } from './domain/user';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /* CREATE USER */
  // Crea un nuevo usuario
  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.create(createUserDto);

    // Generate token to set in cookie
    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    const createUserResponseDto = new CreateUserResponseDto(user);
    const userResponse = createUserResponseDto.returnCreateUserResponse();
    return res.status(HttpStatus.CREATED).json({
      data: {
        user: userResponse,
        token,
      },
    });
  }

  /* UPDATE USER */
  @Put()
  @UseGuards(AuthGuard)
  async update(
    @Body(new ValidationPipe()) payload: UpdateUserDto,
    @Req() req: Request & { user: UserToken },
  ) {
    const userId = req.user.id;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return this.usersService.update(userId, payload);
  }
}
