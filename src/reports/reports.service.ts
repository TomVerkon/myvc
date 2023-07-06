import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });
    if (!report) throw new NotFoundException('report not found');
    report.approved = approved;
    return await this.repo.save(report);
  }

  async find(user: User) {
    return await this.repo.find({ where: { user: user } });
  }

  async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select(['AVG(price)', 'price', `ABS(mileage - ${mileage}) as "mileage_diff"`])
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  async updateReport(id: number, dto: CreateReportDto, user: User) {
    const report = await this.repo.findOneBy({ id });
    if (!report) throw new NotFoundException('report not found');
    report.make = dto.make;
    report.model = dto.model;
    report.year = dto.year;
    report.lat = dto.lat;
    report.lng = dto.lng;
    report.mileage = dto.mileage;
    report.price = dto.price;
    if (!report.user) {
      report.user = user;
    }
    return await this.repo.save(report);
  }
}
