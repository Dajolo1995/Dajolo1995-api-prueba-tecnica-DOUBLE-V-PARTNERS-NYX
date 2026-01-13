import { Module } from "@nestjs/common";
import { DebtParticipantController } from "./debt-participant.controller";
import { DebtParticipantService } from "./debtParticipant.service";
import { ErrorModule } from "src/error/error.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
        imports: [ErrorModule, PrismaModule],
  controllers: [DebtParticipantController],
  providers: [DebtParticipantService],
  exports: [DebtParticipantService],
})
export class DebtParticipantModule {}
