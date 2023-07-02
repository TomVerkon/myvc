import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Password } from './password';

describe('AuthService', () => {
  let service: AuthService;
  let fakeFindReturn: User[] = [];
  //let fakeCreateReturn: User = { id: 1, email, password };

  beforeEach(async () => {
    //create a fake copy of usersService
    const fakeUsersService = {
      find: () => Promise.resolve(fakeFindReturn),
      create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('signin throws a NotFoundException if email is not found', async () => {
    fakeFindReturn = [];
    try {
      await service.signin('test@test.com', 'password');
    } catch (e: any | unknown) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('signin throws a BadRequestException if passwords do not match', async () => {
    const salt = 'c99b7ec53bb9b3bc';
    const password = await Password.generateKey('password1', salt);
    const resolvedPassword = `${password}.${salt}`;

    fakeFindReturn = [{ id: 1, email: 'test@test.com', password: resolvedPassword }];
    try {
      await service.signin('test@test.com', 'password');
    } catch (e: any | unknown) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('signin returns a valid user if passwords match', async () => {
    const salt = 'c99b7ec53bb9b3bc';
    const password = await Password.generateKey('password', salt);
    const resolvedPassword = `${password}.${salt}`;

    fakeFindReturn = [{ id: 1, email: 'test@test.com', password: resolvedPassword }];
    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });

  it('signup returns a BadRequstException is email is in use', async () => {
    fakeFindReturn = [{ id: 1, email: 'test@test.com', password: 'whoCares' }];
    await expect(service.signup('test@test.com', 'password')).rejects.toThrow(BadRequestException);
  });

  it('signup returns a created user with encrypetd and salted password', async () => {
    fakeFindReturn = [];
    const user = await service.signup('test@test.com', 'password');
    expect(user).toBeDefined();
    const [hash, salt] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });
});
