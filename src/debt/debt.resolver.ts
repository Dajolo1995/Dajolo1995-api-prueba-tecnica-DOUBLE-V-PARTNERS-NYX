import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DebtService } from './debt.service';
import { CreateDebtInput } from './dto/createDebt.dto';

@Resolver()
export class DebtResolver {
  constructor(private readonly debtService: DebtService) {}

  @Mutation(() => String)
  async createDebt(@Args('input') input: CreateDebtInput) {
    await this.debtService.createDebt(input);
    return 'DEBT_CREATED';
  }

  @Query(() => [String])
  async listDebtsByUser(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    const debts = await this.debtService.listDebtsByUser(userId);
    return 'Hola';
  }

  @Query(() => String)
  async getDebtById(@Args('debtId', { type: () => String }) debtId: string) {
    const debt = await this.debtService.getDebtById(debtId);
    return debt.id;
  }

  @Mutation(() => String)
  async markDebtAsPaid(@Args('debtId', { type: () => String }) debtId: string) {
    await this.debtService.markDebtAsPaid(debtId);
    return 'DEBT_PAID';
  }

  @Mutation(() => String)
  async updateDebt(
    @Args('debtId', { type: () => String }) debtId: string,
    @Args('description', { type: () => String, nullable: true })
    description?: string,
    @Args('totalAmount', { type: () => Number, nullable: true })
    totalAmount?: number,
  ) {
    await this.debtService.updateDebt(debtId, {
      description,
      totalAmount,
    });
    return 'DEBT_UPDATED';
  }

  @Mutation(() => Boolean)
  async deleteDebt(@Args('debtId', { type: () => String }) debtId: string) {
    return this.debtService.deleteDebt(debtId);
  }

  @Query(() => String)
  async debtSummaryByUser(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    const summary = await this.debtService.debtSummaryByUser(userId);
    return JSON.stringify(summary);
  }
}
