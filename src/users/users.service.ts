import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // nestjs does not play well with generics,
  // hence the @InjectRepository(User) to help it
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(body: CreateUserDto) {
    return await this.repo.save(this.repo.create(body));
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} was not found`);
    return user;
  }

  async find(email: string) {
    const users = await this.repo.find({ where: { email } });
    if (!users || !users[0]) throw new NotFoundException(`User with email: ${email} was not found`);
    return users;
  }
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }
  remove(id: string) {}
}
