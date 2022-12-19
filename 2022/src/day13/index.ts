import run from "aocrunner"
import { Packet, orderPackets } from "../utils/day13.util.js"

const DIVIDERS: Packet[] = [[[2]], [[6]]]

const parseInput = (rawInput: string): Packet[][] => {
  return rawInput
    .split("\n\n")
    .map((rps) => rps.split("\n"))
    .map((pair) => pair.map((pStr) => eval(pStr))) as Packet[][]
}

const part1 = (rawInput: string) =>
  parseInput(rawInput).reduce((sum: number, curr: Packet[], idx: number) => {
    return orderPackets(curr[0], curr[1]) < 0 ? sum + idx + 1 : sum
  }, 0)

const part2 = (rawInput: string) => {
  return parseInput(rawInput)
    .flat(1)
    .concat(DIVIDERS)
    .sort(orderPackets)
    .reduce(
      (key: number, packet: Packet, idx: number) =>
        DIVIDERS.includes(packet) ? key * (idx + 1) : key,
      1,
    )
}

run({
  part1: {
    tests: [
      {
        input: `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
        `,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
