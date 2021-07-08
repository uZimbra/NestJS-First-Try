import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 8);

    const user = { ...createUserDto, password: hashedPassword };
    const repository = new this.userModel(user);

    try {
      repository.save();

      return {
        message: `O usuário ${user.username} foi criado com sucesso!`,
        data: { ...user },
      };
    } catch (error) {
      return `Ocorreu um erro! ${error}`;
    }
  }

  findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  findAll() {
    return this.userModel.find();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      {
        _id: id,
      },
      { $set: updateUserDto },
      { new: true },
    );
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
