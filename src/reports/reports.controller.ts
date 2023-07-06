import { Body, Controller, Get, Param, Post, UseGuards, Patch, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Serialize(ReportDto)
  async approveReport(@Body() body: ApproveReportDto, @Param('id') id: string) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // @Serialize(ReportDto)
  // async getReportsByUser(@CurrentUser() user: User) {
  //   const reports = await this.reportsService.find(user);
  //   return reports;
  // }

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post('/update/:id')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async updateReport(@Param('id') id: string, @Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.updateReport(parseInt(id), body, user);
  }
}
