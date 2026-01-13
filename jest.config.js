const { createDefaultPreset } = require('ts-jest');
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} **/
module.exports = {
  rootDir: '.', 
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageReporters: ['html', 'text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
