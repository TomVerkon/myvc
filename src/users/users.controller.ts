import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly authService: AuthService) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session) {
    return session.color;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    // // generate jwt and store in session object
    // const userJwt = jwt.sign(
    //   {
    //     id: existingUser.id,
    //     email: existingUser.email,
    //   },
    //   process.env.JWT_KEY!,
    // );

    // req.session = { jwt: userJwt };

    // res.status(StatusCode.OK).send(existingUser);
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    // // generate jwt and store in session object
    // const userJwt = jwt.sign(
    //   {
    //     id: existingUser.id,
    //     email: existingUser.email,
    //   },
    //   process.env.JWT_KEY!,
    // );

    // req.session = { jwt: userJwt };

    // res.status(StatusCode.OK).send(existingUser);
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    return (session.userId = undefined);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  find(@Query('email') email?: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Body() user: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(parseInt(id), user);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
