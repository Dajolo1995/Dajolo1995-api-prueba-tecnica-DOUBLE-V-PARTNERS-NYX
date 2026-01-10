import {
  Controller,
  Post,
  Delete,
  Body,
  Query,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() data: CreateUserDto) {
    return this.authService.registerUser(data);
  }

  @Post('/validate')
  async validate(@Body() body: { id: string; code: string }) {
    return this.authService.validateUser(body.id, body.code);
  }


  @Post('/login')
  async login(@Body() body: { user: string; password: string }) {
    return this.authService.login(body.user, body.password);
  }

}
