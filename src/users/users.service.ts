import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { extractFilenameFromUrl } from '@/shared/utils/extractFilenameFromUrl';
import { FilesService } from '@/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private filesService: FilesService,
  ) {}

  /* GET USERS */
  // Obtiene todos los usuarios
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /* FIND USER BY EMAIL */
  // Busca un usuario utilizando el correo electrónico
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  /* FIND BY ID */
  // Busca un usuario utilizando el id
  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /* CREATE USER */
  // Crea un nuevo usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      ...rest,
      password: passwordHash,
    });
    return this.usersRepository.save(user);
  }

  /* UPDATE USER */
  // Actualiza un usuario
  async update(id: string, user: Partial<User>): Promise<User> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (user.password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(user.password, salt);
      user.password = passwordHash;
    }
    return this.usersRepository.save({ ...found, ...user });
  }

  /* SAVE USER */
  // Guarda un usuario con los cambios realizados en el objeto user
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  /**
   * @description Sube una imagen para la empresa y actualiza el campo image
   * @param { string } id - ID de la empresa
   * @param { Express.Multer.File } file - Archivo de imagen
   * @param { Request } req - Objeto de solicitud
   * @returns { Promise<User> }
   */
  async uploadImage(
    id: string,
    file: Express.Multer.File,
    req: any,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('UserNotFound');
    }

    // Verificar que el archivo tenga un nombre
    if (!file || !file.filename) {
      console.error('Error: Archivo no válido o sin nombre', file);
      throw new Error('ArchivoInvalido');
    }

    // Eliminar la imagen anterior si existe
    if (user.profileImageUrl) {
      const oldFilename = extractFilenameFromUrl(user.profileImageUrl);
      if (oldFilename) {
        try {
          this.filesService.deleteFile(oldFilename);
        } catch (error) {
          // Si hay error al eliminar, lanzamos el error
          throw new Error(`Error al eliminar imagen anterior: ${error}`);
        }
      }
    }

    // Generar URL del archivo
    const imageUrl = this.filesService.getFileUrl(file.filename, req);

    // Actualizar el producto con la nueva imagen
    return this.update(user.id, { ...user, profileImageUrl: imageUrl });
  }
}
