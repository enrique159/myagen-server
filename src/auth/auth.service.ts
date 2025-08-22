import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findUserByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }
}
