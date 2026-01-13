import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ErrorModule } from "src/error/error.module";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { EmailModule } from "src/emails/email.module";

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [ErrorModule, UserModule, EmailModule],
    exports: [AuthService],
})

export class AuthModule {}