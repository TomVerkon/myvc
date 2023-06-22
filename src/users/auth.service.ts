import { Injectable, NotFoundException, BadRequestException, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Password } from './password';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(body: CreateUserDto) {
    const { email, password } = body;
    // Make sure email is not in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('EMail is already in use');
    // hash users password
    const encryptedPasssword = await Password.toHash(password);
    //create the user
    return await this.usersService.create({ email, password: encryptedPasssword });
  }

  async signin(body: CreateUserDto) {
    const { email, password } = body;
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('Bad credentials');
    //const encryptedPasssword = await Password.toHash(password);
    if (await Password.compare(user.password, password)) {
      return user;
    } else {
      throw new BadRequestException('Bad credentials');
    }
  }
}
