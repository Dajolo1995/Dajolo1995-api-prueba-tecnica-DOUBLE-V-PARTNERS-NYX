import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtInput } from './dto/createDebt.dto';

@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  async createDebt(@Body() input: CreateDebtInput) {
    await this.debtService.createDebt(input);
    return {
      message: 'DEBT_CREATED',
    };
  }

  @Get()
  async listDebtsByUser(@Query('userId') userId: string) {
    return this.debtService.listDebtsByUser(userId);
  }

  @Get(':debtId')
  async getDebtById(@Param('debtId') debtId: string) {
    return this.debtService.getDebtById(debtId);
  }

  @Patch(':debtId/paid')
  async markDebtAsPaid(@Param('debtId') debtId: string) {
    await this.debtService.markDebtAsPaid(debtId);
    return {
      message: 'DEBT_PAID',
    };
  }

  @Patch(':debtId')
  async updateDebt(@Param('debtId') debtId: string, @Body() input: any) {
    await this.debtService.updateDebt(debtId, input);
    return {
      message: 'DEBT_UPDATED',
    };
  }

  @Delete(':debtId')
  async deleteDebt(@Param('debtId') debtId: string) {
    return this.debtService.deleteDebt(debtId);
  }

  @Get('summary/:userId')
  async debtSummaryByUser(@Param('userId') userId: string) {
    return this.debtService.debtSummaryByUser(userId);
  }
}
