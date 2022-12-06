import run from "aocrunner"

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((s: string) => Number.parseInt(s))
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const fuelNeeded = input.map(massToFuel)

  return fuelNeeded.reduce((sum: number, mass: number) => sum + mass)
}

const massToFuel = (mass: number) => Math.floor(mass / 3) - 2

const calcFuel = (mass: number) => {
  let totalFuel = 0
  let newMass = mass
  let newFuel = 0

  while (true) {
    newFuel = massToFuel(newMass)
    if (newFuel <= 0) { break }
    totalFuel += newFuel
    newMass = newFuel
  }

  return totalFuel
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const fuelNeeded = input.map(calcFuel)

  return fuelNeeded.reduce((sum: number, mass: number) => sum + mass, 0)
}

run({
  part1: {
    tests: [
      {
        input: `
        12
        14
        1969
        100756
        `,
        expected: 2 + 2 + 654 + 33583,
      },
    ],
    solution: part1,
  },
/* 
example:

A module of mass 14 requires 2 fuel.
This fuel requires no further fuel (2 divided by 3 and rounded down is 0, which would call for a negative fuel), so the total fuel required is still just 2.
At first, a module of mass 1969 requires 654 fuel. Then, this fuel requires 216 more fuel (654 / 3 - 2). 216 then requires 70 more fuel, which requires 21 fuel, which requires 5 fuel, which requires no further fuel. So, the total fuel required for a module of mass 1969 is 654 + 216 + 70 + 21 + 5 = 966.
The fuel required by a module of mass 100756 and its fuel is: 33583 + 11192 + 3728 + 1240 + 411 + 135 + 43 + 12 + 2 = 50346.
*/
  part2: {
    tests: [
      {
        input: `
        14
        `,
        expected: 2,
      },
      {
        input: `
        1969
        `,
        expected: 966,
      },
      {
        input: `
        100756
        `,
        expected: 50346,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
