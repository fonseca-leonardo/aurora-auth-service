const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

export default {
  clearMocks: true,

  collectCoverage: true,

  setupFiles: ['<rootDir>/jest.setup.ts'],

  collectCoverageFrom: ['<rootDir>/src/modules/**/services/*.ts'],

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  coverageReporters: ['text-summary', 'lcov'],

  preset: 'ts-jest',

  testEnvironment: 'node',

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),

  testMatch: ['**/*.spec.ts'],
};
