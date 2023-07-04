import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Injectable()
export class ReportsService {
  // nestjs does not play well with generics,
  // hence the @InjectRepository(User) to help it understand
  constructor(@InjectRepository(Report) private readonly repo: Repository<Report>) {}

  async create(dto: CreateReportDto, user: User) {
    const report = this.repo.create(dto);
    report.user = user;
    return await this.repo.save(report);
  }

  async approveReport(id: number, approved: boolean) {
    console.log('service approved: ', approved);
    const report = await this.repo.findOneBy({ id });
    report.approved = approved;
    return await this.repo.save(report);
  }

  async find(user: User) {
    console.log('User: ', user);
    return await this.repo.find({ where: { user: user } });
  }
}
