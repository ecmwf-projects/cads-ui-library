const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

module.exports = async () => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    /**
     * Widgets coverage is taken care by Cypress component testing.
     */
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/widgets/**/*.tsx'],
    coverageThreshold: {
      global: { lines: 80 }
    },
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    setupFilesAfterEnv: ['./__tests__/setupTests.ts'],
    testMatch: ['**/__tests__/**/*.(test|spec).ts?(x)']
  }
}
