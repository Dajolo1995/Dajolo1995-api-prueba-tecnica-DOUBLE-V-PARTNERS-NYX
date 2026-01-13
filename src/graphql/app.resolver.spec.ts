import 'reflect-metadata';
import { AppResolver } from './app.resolver';

describe('AppResolver', () => {
  let resolver: AppResolver;

  beforeEach(() => {
    resolver = new AppResolver();
  });

  it('health → should return OK', () => {
    const result = resolver.health();

    expect(result).toBe('OK');
  });
});
