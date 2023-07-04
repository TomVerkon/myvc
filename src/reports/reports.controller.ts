import { Body, Controller, Get, Param, Post, UseGuards, Patch } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    console.log('controller createReport: ', body);
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async approveReport(@Body() body: ApproveReportDto, @Param('id') id: string) {
    console.log('controller approved: ', body);
    return this.reportsService.approveReport(parseInt(id), body.approved);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async getReportsByUser(@CurrentUser() user: User) {
    console.log('controller: ', user);
    const reports = await this.reportsService.find(user);
    return reports;
  }
}
