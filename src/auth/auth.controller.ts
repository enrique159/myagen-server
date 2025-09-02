import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { AuthGuard } from './auth.guard';
import { UserStatus, UserToken } from '@/users/domain/user';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /*
   * CHECK
   * Verifica si el token de la cookie existe y si es válido
   * Si es válido, devuelve el usuario
   */
  @Get('check')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async check(@Req() req: Request & { user: UserToken }) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const userResponse = new SignInResponseDto(user);
    return userResponse.returnSignInResponse();
  }

  /*
   * SIGNIN
   * Verifica si el token de la cookie existe y si es válido
   * Si es válido, devuelve el usuario
   */
  @Post('signin')
  @HttpCode(200)
  async signin(
    @Body(new ValidationPipe()) signInDto: SignInDto,
    @Res() res: Response,
  ) {
    const { email, password } = signInDto;
    try {
      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException(
          'No se encontró ningún usuario con ese correo',
        );
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new BadRequestException(
          'Correo electrónico o contraseña incorrectos',
        );
      }

      const signInResponse = new SignInResponseDto(user);

      // Generate token to set in cookie
      const token = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      });
      return res.json({
        data: {
          user: signInResponse.returnSignInResponse(),
          token,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error; // Re-throw NestJS specific exceptions
      }

      throw new UnauthorizedException(
        'Ocurrió un error, por favor intenta de nuevo más tarde',
      );
    }
  }

  /*
   * SIGNOUT
   * Elimina el token de la cookie
   */
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res() response: Response) {
    return response.status(HttpStatus.OK).json({ message: 'Signout success' });
  }
}
