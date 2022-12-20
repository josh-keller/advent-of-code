import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((str, idx) => ({ n: parseInt(str), orig: idx }))

const part1 = (rawInput: string) => {
  let numbers = parseInput(rawInput)
  const length = numbers.length

  /* console.log(numbers.map(({ n }) => n.toString()).join(", ")) */
  for (let i = 0; i < length; i++) {
    const idx = numbers.findIndex((n) => n.orig === i)
    const [elem] = numbers.splice(idx, 1)

    const newIdxCandidate = (idx + elem.n) % length
    const newIdx =
      newIdxCandidate <= 0
        ? length - 1 + newIdxCandidate
        : newIdxCandidate === length - 1
        ? 0
        : newIdxCandidate
    /* let newIdx = idx */
    /* const dir = elem.n / Math.abs(elem.n) */
    /* for (let steps = elem.n; steps !== 0; steps -= dir) { */
    /*   newIdx += dir */
    /*   if (newIdx === 0) { */
    /*     newIdx = length - 1 */
    /*   } else if (newIdx === length - 1) { */
    /*     newIdx = 0 */
    /*   } */
    /* } */

    numbers = [...numbers.slice(0, newIdx), elem, ...numbers.slice(newIdx)]
    /* console.log() */
    /* console.log(numbers.map(({ n }) => n.toString()).join(", ")) */
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
