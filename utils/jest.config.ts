// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  roots: ['./'],
  globalSetup: './lib/jest/setup.ts',
  globalTeardown: './lib/jest/teardown.ts',
}

export default jestConfig