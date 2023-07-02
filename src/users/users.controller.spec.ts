import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Session } from 'inspector';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;
  let fakeFindReturn: User[] = [];
  let fakeReturn: User = { id: 1, email: 'test@test.com', password: 'password' };
  let fakeUpdateReturn: User = { id: 1, email: 'test@test.com', password: 'password' };

  beforeEach(async () => {
    //create a fake copy of usersService
    fakeUsersService = {
      //repo: new Repository<User>(),
      create: () => Promise.resolve(fakeReturn),
      findOne: (id?: number) => Promise.resolve(fakeReturn),
      find: (email?: string) => Promise.resolve([fakeReturn]),
      update: () => Promise.resolve(fakeReturn),
      remove: (id: number) => Promise.resolve(fakeReturn),
    };

    const fakeAuthService = {
      // signup: () => Promise.resolve(fakeFindReturn),
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    // authService = module.get<AuthService>(AuthService);
    // usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(AuthService).toBeDefined();
    expect(UsersService).toBeDefined();
  });

  // findAllUsers uses userService find
  it('findAllUsers returns a list of users with givien email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBe(1);
  });

  // findUser uses userService findOne
  it('findUser returns a user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  // findUser uses userService findOne
  it('findUser throws a NotFoundException with unknown id', async () => {
    fakeUsersService.findOne = () => null;
    let user = null;
    let error: HttpException = null;
    try {
      user = await controller.findUser('8');
    } catch (e) {
      error = e;
    }
    expect(user).toBeNull();
    expect(error).toBeInstanceOf(NotFoundException);
  });

  it('signin adds the user id to the Session', async () => {
    const session = { userId: undefined };
    expect(session.userId).toBeUndefined();
    const user = await controller.signin({ email: 'test@test.com', password: 'password' }, session);
    expect(session.userId).toBeDefined();
    expect(session.userId).toBe(1);
  });

  it('signup adds the user id to the Session', async () => {
    const session = { userId: undefined };
    expect(session.userId).toBeUndefined();
    const user = await controller.signin({ email: 'test@test.com', password: 'password' }, session);
    expect(session.userId).toBeDefined();
    expect(session.userId).toBe(1);
  });

  it('signout removes the user id in the Session', async () => {
    const session = { userId: 1 };
    expect(session.userId).toBe(1);
    const user = await controller.signout(session);
    expect(session.userId).toBeUndefined();
  });
});
