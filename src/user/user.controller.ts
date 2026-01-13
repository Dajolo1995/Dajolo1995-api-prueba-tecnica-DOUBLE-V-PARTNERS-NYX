import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Obtiene todos los usuarios activos
   * Opcionalmente excluye un usuario por id
   * 
   * GET /users?excludeId=uuid
   */
  @Get()
  async getUsers(
    @Query('excludeId') excludeId?: string,
  ) {
    return this.userService.getUser(excludeId);
  }
}
