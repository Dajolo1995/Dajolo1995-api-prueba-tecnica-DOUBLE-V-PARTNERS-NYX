import {
  Injectable,
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  handleError(msgServer: string, logger: string, error: HttpException) {
    console.log(error);
    this.logger.error(logger);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException(msgServer || 'Error interno');
  }
}
