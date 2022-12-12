import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n").map(line => line.split(" "))
  return lines.map(([instruction, num]) => {
    return { instruction, number: Number(num) }
  })
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let xRegister = 1
  const output = new Array<number>(241)
  let toAdd = 0
  let onCycle = 1

  for (let cycle = 1; cycle <= 240; cycle++) {
    output[cycle - 1] = xRegister
    if (cycle === onCycle) {
      // Execute previous instruction
      xRegister += toAdd
      // Load next instruction
      const {instruction, number} = input.shift() as {instruction: string, number: number}
      if (instruction === 'addx') {
        toAdd = number
        onCycle = cycle + 2
      } else {
        toAdd = 0
        onCycle = cycle + 1
      }
    }
  }

  let total = 0

  for (let i = 20; i <= 220; i += 40) {
    total += output[i] * i
  }

  return total
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let xRegister = 1
  const output = new Array<string>(240).fill(".")
  let toAdd = 0
  let onCycle = 0

  for (let cycle = 0; cycle <= 240; cycle++) {
    const spritePos = (cycle - 1) % 40

    // Draw
    if (Math.abs(xRegister - spritePos) <= 1 && cycle !== 0) {
      output[cycle - 1] = "#"
    }

    if (cycle === 240) { break }

    if (cycle === onCycle) {
      // Execute previous instruction
      xRegister += toAdd
      // Load next instruction
      const {instruction, number} = input.shift() as {instruction: string, number: number}

      if (instruction === 'addx') {
        toAdd = number
        onCycle = cycle + 2
      } else {
        toAdd = 0
        onCycle = cycle + 1
      }
    }
  }

  // console.log("Raw:", output.join(""))
  // Print
  for (let i = 0; i < 6; i++) {
    console.log(output.slice(i * 40, i * 40 + 40).join(''))
  }
  return
}

run({
  part1: {
    tests: [
      {
        input: `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
        `,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
        `,
        expected: 13140,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
