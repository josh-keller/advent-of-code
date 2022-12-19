import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const instructions = new Array<[number, number]>()

  lines.forEach(line => instructions.push(...makeInstructions(line)))
  return instructions

}

function makeInstructions(raw: string): [number, number][] {
  const [dir, count] = raw.split(" ")
  let instruction: [number, number] = [0, 0]

  switch (dir) {
    case 'U':
      instruction = [0, 1]
      break
    case 'D':
      instruction = [0, -1]
      break
    case 'R':
      instruction = [1, 0]
      break
    case 'L':
      instruction = [-1, 0]
      break
  }

  return new Array(Number(count)).fill(instruction)
}

const part1 = (rawInput: string) => {
  const moves = parseInput(rawInput)
  let head: [number, number] = [0, 0]
  let tail: [number, number] = [0, 0]
  const tailVisitedLocations = new Set<string>([tail.toString()])

  moves.forEach(move => {
    head = [head[0] + move[0], head[1] + move[1]]
    tail = moveTail(head, tail)
    tailVisitedLocations.add(tail.toString())
  })

  return tailVisitedLocations.size
}

function moveTail(head: [number, number], tail: [number, number]): [number, number] {
  console.log(head, tail)
  if (Math.abs(head[0] - tail[0]) <= 1 && Math.abs(head[1] - tail[1]) <= 1) {
    return tail.slice() as [number, number]
  }

  const dx = Math.abs(head[0] - tail[0])
  const dy = Math.abs(head[1] - tail[1])

  if (dx === 2 && dy === 2) {
    return [Math.floor((head[0] + tail[0]) / 2), Math.floor((head[1] + tail[1])/ 2)] 
  }
  
  if (dx === 2) {
    return [Math.floor((head[0] + tail[0]) / 2), head[1]]
  }

  if (dy === 2) {
    return [head[0], Math.floor((head[1] + tail[1])/ 2)]
  }

  throw new Error("Should not have reached end")
}

const part2 = (rawInput: string) => {
  const moves = parseInput(rawInput)
  const knots = new Array<[number, number]>(10).fill([0, 0]).map(() => [0, 0].slice())
  const tailVisitedLocations = new Set<string>([knots[9].toString()])

  moves.forEach(move => {
    knots[0] = [knots[0][0] + move[0], knots[0][1] + move[1]]
    for (let i = 1; i < knots.length; i++) {
      knots[i] = moveTail(knots[i - 1], knots[i])
    }
    tailVisitedLocations.add(knots[9].toString())
  })

  return tailVisitedLocations.size
}

run({
  part1: {
    tests: [
      {
        input: `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
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
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
        `,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
