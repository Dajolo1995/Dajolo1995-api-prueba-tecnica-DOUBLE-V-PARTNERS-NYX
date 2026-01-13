import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserService } from "./user.service";
import { ErrorModule } from "src/error/error.module";
import { UserController } from "./user.controller";

@Module({
    providers: [UserService],
    imports: [PrismaModule, ErrorModule],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}