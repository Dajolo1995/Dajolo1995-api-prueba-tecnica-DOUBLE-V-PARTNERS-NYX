import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DebtParticipantService } from './debtParticipant.service';
import { AddDebtParticipantDto } from './dto/add-debt-participant.dto';

@Controller('debts/:debtId/participants')
export class DebtParticipantController {
  constructor(
    private readonly debtParticipantService: DebtParticipantService,
  ) {}

  @Post()
  addDebtParticipant(
    @Param('debtId') debtId: string,
    @Body() body: AddDebtParticipantDto,
  ) {
    const { userId, amount } = body;

    return this.debtParticipantService.addParticipant(debtId, userId, amount);
  }

  @Get()
  listDebtParticipants(@Param('debtId') debtId: string) {
    return this.debtParticipantService.listParticipants(debtId);
  }

  @Patch(':userId/pay')
  payDebtParticipant(
    @Param('debtId') debtId: string,
    @Param('userId') userId: string,
  ) {
    return this.debtParticipantService.markParticipantAsPaid(debtId, userId);
  }
}
