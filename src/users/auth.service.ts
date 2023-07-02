import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Password } from './password';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  //  async signup(body: CreateUserDto) {
  async signup(email: string, password: string) {
    // Make sure email is not in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('EMail is already in use');
    // hash users password
    const encryptedPassword = await Password.toHash(password);
    //create the user
    const user = await this.usersService.create(email, encryptedPassword);
    return user;
  }

  async signin(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (!users[0]) {
      throw new NotFoundException('Bad credentials');
    }
    if (await Password.compare(users[0].password, password)) {
      return users[0];
    } else {
      throw new BadRequestException('Bad credentials');
    }
  }
}
