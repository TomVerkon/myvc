import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Password } from './password';

let service: AuthService;
let fakeFindReturn: User[] = [];
//let fakeCreateReturn: User = { id: 1, email, password };

describe('AuthService', () => {
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
    try {
      const user = await service.signin('test@test.com', 'password');
      fail('It should not reach here');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('signin throws a BadRequestException if passwords do not match', async () => {
    const salt = 'c99b7ec53bb9b3bc';
    const password = await Password.generateKey('password1', salt);
    const resolvedPassword = `${password}.${salt}`;

    fakeFindReturn = [{ id: 1, email: 'test@test.com', password: resolvedPassword }];
    try {
      const user = await service.signin('test@test.com', 'password');
      fail('It should not reach here');
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('signin returns a valid user if passwords match', async () => {
    const salt = 'c99b7ec53bb9b3bc';
    const password = await Password.generateKey('password', salt);
    const resolvedPassword = `${password}.${salt}`;

    fakeFindReturn = [{ id: 1, email: 'test@test.com', password: `${password}.${salt}` }];
    try {
      const user = await service.signin('test@test.com', 'password');
      expect(user).toBeDefined();
    } catch (e: any) {
      fail(e);
    }
  });

  it('signup returns a BadRequstException is email is in use', async () => {
    fakeFindReturn = [{ id: 1, email: 'test@test.com', password: 'whoCares' }];
    try {
      const user = await service.signup('test@test.com', 'password');
      fail('It should not reach here');
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect((e as BadRequestException).message).toEqual('EMail is already in use');
    }
  });

  it('signup returns a created user', async () => {
    fakeFindReturn = [];
    const user = await service.signup('test@test.com', 'password');
    console.log('testUser:', user);
    const [hash, salt] = user.password.split('.');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(user.email).toEqual('test@test.com');
  });
});
