import run from "aocrunner"

const parseInput = (rawInput: string) => {
  let elves = rawInput.split("\n\n")

  return elves.map(elf => elf.split("\n").map(cal => Number.parseInt(cal)))
}

const part1 = (rawInput: string) => {
  const elfCalories = parseInput(rawInput)

  return Math.max(...elfCalories.map(cals => cals.reduce((sum, cal) => sum + cal))).toString()
}

const part2 = (rawInput: string) => {
  const elfCalorieTotals = parseInput(rawInput).map(cals => cals.reduce((sum, cal) => sum + cal))

  return elfCalorieTotals.sort((a, b) => b - a).slice(0, 3).reduce((sum, val) => sum + val).toString()
}

run({
  part1: {
    tests: [
      {
        input: `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
        `,
        expected: "24000",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
        `,
        expected: "45000",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
