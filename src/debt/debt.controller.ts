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


/**
 * Controller REST de Deudas
 */
@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  /* ======================================================
   * HEALTH
   * ====================================================== */

  @Get('health')
  health() {
    return 'ok';
  }

  /* ======================================================
   * CREATE
   * ====================================================== */

  @Post()
  async createDebt(@Body() input: CreateDebtInput) {
    await this.debtService.createDebt(input);
    return {
      message: 'DEBT_CREATED',
    };
  }

  /* ======================================================
   * READ
   * ====================================================== */

  // GET /debts?userId=xxx
  @Get()
  async listDebtsByUser(@Query('userId') userId: string) {
    return this.debtService.listDebtsByUser(userId);
  }

  // GET /debts/:debtId
  @Get(':debtId')
  async getDebtById(@Param('debtId') debtId: string) {
    return this.debtService.getDebtById(debtId);
  }

  /* ======================================================
   * UPDATE
   * ====================================================== */

  // PATCH /debts/:debtId/paid
  @Patch(':debtId/paid')
  async markDebtAsPaid(@Param('debtId') debtId: string) {
    await this.debtService.markDebtAsPaid(debtId);
    return {
      message: 'DEBT_PAID',
    };
  }

  // PATCH /debts/:debtId
  @Patch(':debtId')
  async updateDebt(
    @Param('debtId') debtId: string,
    @Body() input: any,
  ) {
    await this.debtService.updateDebt(debtId, input);
    return {
      message: 'DEBT_UPDATED',
    };
  }

  /* ======================================================
   * DELETE
   * ====================================================== */

  // DELETE /debts/:debtId
  @Delete(':debtId')
  async deleteDebt(@Param('debtId') debtId: string) {
    return this.debtService.deleteDebt(debtId);
  }

  /* ======================================================
   * AGGREGATIONS
   * ====================================================== */

  // GET /debts/summary/:userId
  @Get('summary/:userId')
  async debtSummaryByUser(@Param('userId') userId: string) {
    return this.debtService.debtSummaryByUser(userId);
  }
}
