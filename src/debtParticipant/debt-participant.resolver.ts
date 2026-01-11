import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DebtParticipantService } from './debtParticipant.service';
import { DebtParticipant } from './debt-participant.entity';

@Resolver(() => DebtParticipant)
export class DebtParticipantResolver {
  constructor(
    private readonly debtParticipantService: DebtParticipantService,
  ) {}

  /**
   * Agregar participante a una deuda
   */
  @Mutation(() => DebtParticipant)
  addDebtParticipant(
    @Args('debtId') debtId: string,
    @Args('userId') userId: string,
    @Args('amount') amount: number,
  ) {
    return this.debtParticipantService.addParticipant(
      debtId,
      userId,
      amount,
    );
  }

  /**
   * Listar participantes de una deuda
   */
  @Query(() => [DebtParticipant])
  debtParticipants(@Args('debtId') debtId: string) {
    return this.debtParticipantService.listParticipants(debtId);
  }

  /**
   * Marcar participante como pagado
   */
  @Mutation(() => String)
  payDebtParticipant(
    @Args('debtId') debtId: string,
    @Args('userId') userId: string,
  ) {
    return this.debtParticipantService.markParticipantAsPaid(
      debtId,
      userId,
    );
  }
}
