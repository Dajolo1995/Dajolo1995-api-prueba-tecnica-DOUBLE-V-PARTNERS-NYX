import { API_VERSION } from './apiVersion'; 

describe('API_VERSION', () => {
  it('should be defined', () => {
    expect(API_VERSION).toBeDefined();
  });

  it('should have the correct value', () => {
    expect(API_VERSION).toBe('api/v00');
  });

  it('should be a string', () => {
    expect(typeof API_VERSION).toBe('string');
  });
});
