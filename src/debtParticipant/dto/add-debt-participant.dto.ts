import { IsNumber, IsUUID, Min } from 'class-validator';

export class AddDebtParticipantDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
