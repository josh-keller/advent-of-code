import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const [crateInput, rawMoves] = rawInput.split("\n\n").map(s => s.split("\n"))
  const lastNum = parseInt(crateInput.pop()?.trim().split(' ').pop() as string)
  const stacks = new Array<Array<string>>(lastNum).fill([]).map(() => new Array<string>(0))
  const lastRawCrate = crateInput.length - 1
  const crateLineLength = crateInput[lastRawCrate].length

  for (let line = lastRawCrate; line >= 0; line--) {
    let stackIdx = 0;
    for (let offset = 1; offset < crateLineLength; offset += 4, stackIdx++) {
      if (crateInput[line][offset]?.match(/[A-Z]/)) {
        stacks[stackIdx].push(crateInput[line][offset])
      }
    }
  }

  const moves = rawMoves.map(s => {
    const moveMatches = s.match(/move (\d+) from (\d+) to (\d+)/)
    if (!moveMatches) { throw new Error() }
    
    return {
      count: parseInt(moveMatches[1]),
      from: parseInt(moveMatches[2]) - 1,
      to: parseInt(moveMatches[3]) - 1,
    }
  })

  return { stacks, moves }
}

const part1 = (rawInput: string) => {
  const {stacks, moves} = parseInput(rawInput)

  moves.forEach(move => {
    for ( let i = 0; i < move.count; i ++) {
      const crate = stacks[move.from].pop()
      if (!crate) { throw new Error() }
      stacks[move.to].push(crate)
    }
  })

  return stacks.map(stack => stack[stack.length - 1]).join('')
}

const part2 = (rawInput: string) => {
  const {stacks, moves} = parseInput(rawInput)

  moves.forEach(move => {
    const startIdx = stacks[move.from].length - move.count
    const crates = stacks[move.from].splice(startIdx, move.count)
    stacks[move.to].push(...crates)
  })

  return stacks.map(stack => stack[stack.length - 1]).join('')
}

run({
  part1: {
    tests: [
      {
        input: 
          `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: 
          `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
})
