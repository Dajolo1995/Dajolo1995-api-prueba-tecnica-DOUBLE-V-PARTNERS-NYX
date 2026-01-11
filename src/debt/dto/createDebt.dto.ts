import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class CreateDebtInput {
  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsPositive({
    message: 'El valor de la deuda debe ser mayor a cero',
  })
  totalAmount: number;

  @Field(() => ID)
  @IsNotEmpty()
  createdById: string;
}
