import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Debt, DebtStatus } from 'src/debt/debt.entity';

@ObjectType()
export class DebtParticipant {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  debtId: string;

  @Field(() => Debt)
  debt: Debt;

  @Field()
  amount: number;

  @Field(() => DebtStatus)
  status: DebtStatus;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
