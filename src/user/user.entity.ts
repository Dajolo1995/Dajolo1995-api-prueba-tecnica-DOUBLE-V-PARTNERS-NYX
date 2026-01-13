import { Field, ObjectType } from '@nestjs/graphql';
import { Debt } from 'src/debt/debt.entity';
import { DebtParticipant } from 'src/debtParticipant/debt-participant.entity';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  nickname: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  code?: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;


  @Field(() => [Debt], { nullable: true })
  debtsCreated?: Debt[];

  @Field(() => [DebtParticipant], { nullable: true })
  debtParticipants?: DebtParticipant[];
}
