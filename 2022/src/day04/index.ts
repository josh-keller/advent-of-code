import run from "aocrunner"
import { Range } from '../utils/Range.js'

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .map((line) => line.split(",").map((r) => new Range(r)))
}

const part1 = (rawInput: string) => {
  return parseInput(rawInput).filter(
    (p) => p[0].contains(p[1]) || p[1].contains(p[0]),
  ).length
}

const part2 = (rawInput: string) => {
  return parseInput(rawInput).filter((p) => p[0].overlaps(p[1])).length
}

run({
  part1: {
    tests: [
      {
        input: `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
