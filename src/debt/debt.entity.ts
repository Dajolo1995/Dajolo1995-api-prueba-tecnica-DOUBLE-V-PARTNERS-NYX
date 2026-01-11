import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { DebtParticipant } from 'src/debtParticipant/debt-participant.entity';


export enum DebtStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
}

@ObjectType()
export class Debt {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field()
  totalAmount: number;

  @Field()
  createdById: string;

  @Field(() => User)
  createdBy: User;

  @Field(() => DebtStatus)
  status: DebtStatus;

  @Field(() => [DebtParticipant], { nullable: true })
  participants?: DebtParticipant[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
