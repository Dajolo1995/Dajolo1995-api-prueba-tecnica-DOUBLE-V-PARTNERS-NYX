import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtResolver } from './debt.resolver';
import { ErrorModule } from 'src/error/error.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
    imports: [ErrorModule, PrismaModule],
    providers: [DebtService, DebtResolver],
    exports: [DebtService],
})
export class DebtModule {}