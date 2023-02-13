const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

module.exports = async () => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/widgets/KeywordSearchWidget.tsx'
    ],
    coverageThreshold: {
      global: { lines: 90 }
    },
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    setupFilesAfterEnv: ['./__tests__/setupTests.ts'],
    testMatch: ['**/__tests__/**/*.(test|spec).ts?(x)']
  }
}
