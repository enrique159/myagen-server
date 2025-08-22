import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException('No está autenticado');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('secretKey'),
      });

      request['user'] = payload;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('La sesión ha expirado');
      }
      throw new UnauthorizedException('No está autenticado');
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const [type, token] = request.cookies.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
