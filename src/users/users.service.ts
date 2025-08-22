import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
}
