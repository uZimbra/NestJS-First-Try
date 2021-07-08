import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user && compareSync(password, user.password)) {
      const { _id, email, username, born_date, __v } = user;
      return { _id, email, username, born_date, __v };
    }

    return null;
  }
}
