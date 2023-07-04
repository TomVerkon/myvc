import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

let createReportDto = {
  price: 120000,
  make: 'Ford',
  model: 'Explorer',
  year: 2004,
  lat: 0,
  lng: 0,
  mileage: 189000,
  approved: false,
} as CreateReportDto;

let user = {
  id: 1,
  email: 'test@gmail.com',
  password: 'dontcare',
} as User;

let report: Report = {
  id: 9,
  price: 120000,
  make: 'Ford',
  model: 'Explorer',
  year: 2004,
  lat: 0,
  lng: 0,
  mileage: 189000,
  approved: false,
  user: user,
};

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportsService: Partial<ReportsService>;

  beforeEach(async () => {
    fakeReportsService = {
      create: (createReportDto, user) => Promise.resolve(report),
      approveReport: (id: 1, approved: true) => Promise.resolve(report),
      find: user => Promise.resolve([report]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: fakeReportsService }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
