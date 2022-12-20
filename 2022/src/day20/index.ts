import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((str, idx) => ({ n: parseInt(str), orig: idx }))

const part1 = (rawInput: string) => {
  let numbers = parseInput(rawInput)
  const length = numbers.length
  const mod = length - 1

  for (let i = 0; i < length; i++) {
    const idx = numbers.findIndex((n) => n.orig === i)
    const [elem] = numbers.splice(idx, 1)
    const newIdx = (((idx + elem.n) % mod) + mod) % mod

    numbers = [...numbers.slice(0, newIdx), elem, ...numbers.slice(newIdx)]
  }

  const zeroIdx = numbers.findIndex((elem) => elem.n === 0)

  return (
    numbers[(zeroIdx + 1000) % length].n +
    numbers[(zeroIdx + 2000) % length].n +
    numbers[(zeroIdx + 3000) % length].n
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `
1
2
-3
3
-2
0
4
`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
