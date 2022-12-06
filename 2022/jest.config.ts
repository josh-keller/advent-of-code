import type {Config} from '@jest/types';
// Sync Object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  resolver: "ts-jest-resolver",
}
export default config
