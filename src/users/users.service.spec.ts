import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {};

  beforeEach(async () => {
    const mockUserReturn = { id: 1, email: 'test@test.com', password: 'password' };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUserReturn),
            find: jest.fn().mockResolvedValue(mockUserReturn),
            findOneBy: jest.fn().mockResolvedValue(mockUserReturn),
            save: jest.fn().mockResolvedValue(mockUserReturn),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
