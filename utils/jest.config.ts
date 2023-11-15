// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import type { JestConfigWithTsJest } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  roots: ['./'],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */),
  globalSetup: './lib/jest/setup.ts',
  globalTeardown: './lib/jest/teardown.ts',
}

export default jestConfig