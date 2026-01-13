import 'reflect-metadata';
import {
  InternalServerErrorException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    service = new ErrorService();
  });

  it('should rethrow HttpException as is', () => {
    const error = new BadRequestException('Bad request');

    expect(() =>
      service.handleError(
        'Server error',
        'ErrorServiceTest',
        error,
      ),
    ).toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException for non-HttpException error', () => {
    const error = new Error('Generic error') as any;

    expect(() =>
      service.handleError(
        'Custom server error',
        'ErrorServiceTest',
        error,
      ),
    ).toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException with default message when msgServer is empty', () => {
    const error = new Error('Generic error') as any;

    try {
      service.handleError('', 'ErrorServiceTest', error);
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerErrorException);
      expect(err.message).toContain('Error interno');
    }
  });

  it('should log error using Logger', () => {
    const spy = jest.spyOn(
      (service as any).logger,
      'error',
    );

    const error = new BadRequestException('Bad request');

    try {
      service.handleError(
        'Server error',
        'LoggerTest',
        error,
      );
    } catch {
  
    }

    expect(spy).toHaveBeenCalledWith('LoggerTest');
  });
});
