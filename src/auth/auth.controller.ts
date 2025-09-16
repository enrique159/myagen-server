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
import { ResendService } from '@/shared/plugins/resend.plugin';
import { verificationCodeTemplate } from '@/shared/plugins/mjml.plugin';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly resendService: ResendService,
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

  /*
   * SEND RECOVERY PASSWORD EMAIL
   * Envía un correo electrónico con un enlace para restablecer la contraseña
   */
  @Post('send-recovery-password-email')
  @HttpCode(HttpStatus.OK)
  async sendRecoveryPasswordEmail(@Body() body: { email: string }) {
    const { email } = body;
    const user = await this.userService.findByEmail(email);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException('No se encontró una cuenta asociada a este correo electrónico');
    }

    const verificationToken = this.jwtService.sign({ id: user.id, }, { expiresIn: '1h', });
    this.resendService.sendEmail(
      user.email,
      'Restablece tu contraseña',
      verificationCodeTemplate(
        `${this.configService.get('clientUrl')}/auth/recover-password?token=${verificationToken}`,
      ),
    );
    return { message: 'Correo electrónico enviado correctamente.' };
  }

  /*
   * RECOVER PASSWORD TOKEN
   * Restablece una contraseña nueva
   */
  @Post('recover-password')
  @HttpCode(HttpStatus.OK)
  async validateRecoveryPasswordToken(@Body() body: { token: string, password: string }) {
    const { token, password } = body;
    try {
      const tokenData = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findOne(tokenData.id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado, vuelva a intentar enviar el correo de recuperación.');
      }
      await this.userService.update(user.id, { password });
      return { message: 'Contraseña restablecida correctamente.' };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El enlace de recuperación ha expirado. Por favor, solicita un nuevo enlace.');
      } else if (error?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('El enlace de recuperación no es válido. Por favor, solicita un nuevo enlace.');
      }
      throw error;
    }
  }
}
