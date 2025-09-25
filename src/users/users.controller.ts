import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  /* UPLOAD COMPANY IMAGE */
  // Carga una imagen de perfil de la compañia
  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = crypto.randomUUID();
          const extension = extname(file.originalname);
          callback(null, `${uniqueName}${extension}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const validExtensions = /(jpg|jpeg|png|webp)$/;
        const isValid = validExtensions.test(
          extname(file.originalname).toLowerCase(),
        );
        if (!isValid) {
          return callback(
            new BadRequestException('Tipo de archivo no permitido'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: UserToken },
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No se proporcionó un archivo');
    }
    const userId = req.user.id;
    try {
      return await this.usersService.uploadImage(userId, file, req);
    } catch (error) {
      console.error('Error en uploadImage:', error);
      if (error?.message === 'UserNotFound') {
        throw new NotFoundException('El usuario no se encontró');
      }
      if (error?.message === 'ArchivoInvalido') {
        throw new BadRequestException('El archivo proporcionado no es válido');
      }
      throw new InternalServerErrorException(
        `Error al subir la imagen: ${error.message}`,
      );
    }
  }
}
