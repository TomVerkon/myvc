import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log('controller:', body);
    return this.userService.create(body);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  find(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch()
  updateUser(@Param('id') id: string) {
    return this.userService.update(id);
  }

  @Delete()
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
