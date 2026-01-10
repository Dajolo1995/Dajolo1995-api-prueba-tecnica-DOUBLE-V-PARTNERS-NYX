import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserService } from "./user.service";
import { ErrorModule } from "src/error/error.module";

@Module({
    providers: [UserService],
    imports: [PrismaModule, ErrorModule],
    exports: [UserService],
})
export class UserModule {}