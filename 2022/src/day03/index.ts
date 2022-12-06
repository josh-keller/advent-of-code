import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split("\n").map(s => s.split(""))

const findMistake = (s: string[]): string => {
  const firstCharSet = new Set(s.slice(0, s.length / 2))
  const second = s.slice(s.length / 2)
  return second.filter((c) => firstCharSet.has(c))[0]
}

const itemPriority = (item: string): number => {
  return item.toLowerCase() === item
    ? item.charCodeAt(0) - 96
    : item.charCodeAt(0) - 38
}

function findGroupBadge(i: number, sackSets: Set<string>[]): string {
  return [...sackSets[i]].filter(
    (e) => sackSets[i + 1].has(e) && sackSets[i + 2].has(e),
  )[0]
}

const part1 = (rawInput: string) => {
  const sacks = parseInput(rawInput)
  return sacks
    .map(findMistake)
    .map(itemPriority)
    .reduce((s, n) => s + n)
}

const part2 = (rawInput: string) => {
  const sackSets = parseInput(rawInput).map((sack) => new Set(sack))
  const badges: string[] = []

  for (let i = 0; i < sackSets.length; i += 3) {
    badges.push(findGroupBadge(i, sackSets))
  }

  return badges.map(itemPriority).reduce((s, n) => s + n)
}

run({
  part1: {
    tests: [
      {
        input: `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
