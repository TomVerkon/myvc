import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from './report.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let mockReport = {
    id: 7,
    price: 120000,
    make: 'Ford',
    model: 'Explorer',
    year: 2004,
    lat: 0,
    lng: 0,
    mileage: 189000,
    approved: false,
    userId: null,
  };
  let mockUserReport = {
    id: 7,
    price: 120000,
    make: 'Ford',
    model: 'Explorer',
    year: 2004,
    lat: 0,
    lng: 0,
    mileage: 189000,
    approved: false,
    userId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: {
            create: jest.fn().mockResolvedValue(mockReport),
            find: jest.fn().mockResolvedValue(mockUserReport),
            findOneBy: jest.fn().mockResolvedValue(mockUserReport),
            save: jest.fn().mockResolvedValue(mockUserReport),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
