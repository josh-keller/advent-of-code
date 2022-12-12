import run from "aocrunner"

const startOfNonRepeating = (input: string, length: number): number => {
  let start = 0
  let end = 0
  const letters: { [letter: string]: boolean } = {}

  while (end - start < length) {
    if (letters[input[end]]) {
      while (input[start] != input[end]) {
        letters[input[start]] = false
        start++
      }

      start++
    } else {
      letters[input[end]] = true
    }

    end++
  }

  return end
}

const part1 = (rawInput: string) => {
  return startOfNonRepeating(rawInput, 4)
}

const part2 = (rawInput: string) => {
  return startOfNonRepeating(rawInput, 14)
}

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
