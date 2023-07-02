import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  // nestjs does not play well with generics,
  // hence the @InjectRepository(User) to help it understand
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  async find(email?: string) {
    return await this.repo.find({ where: { email } });
    // if (email) return await this.repo.find({ where: { email } });
    // else return await this.repo.find({});
  }

  async update(id: number, attrs: Partial<UpdateUserDto>) {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return await this.repo.remove(user);
  }
}
