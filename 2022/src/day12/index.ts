import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const rawMap = rawInput.split("\n").map((line) => line.split(""))
  let start = new Position(-1, -1)
  let goal = new Position(-1, -1)

  for (let r = 0; r < rawMap.length; r++) {
    for (let c = 0; c < rawMap[0].length; c++) {
      if (rawMap[r][c] === "S") {
        start = new Position(c, r)
        rawMap[r][c] = "a"
      }

      if (rawMap[r][c] === "E") {
        goal = new Position(c, r)
        rawMap[r][c] = "z"
      }

      if (start.x !== -1 && goal.x !== -1) {
        return { map: new Map(rawMap), start, goal }
      }
    }
  }

  throw new Error("Failed to parse")
}

class Position {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  manhattan(other: Position): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  toString(): string {
    return `${this.x},${this.y}`
  }
}

class Map {
  protected map: string[][]
  maxHeight: number
  maxWidth: number

  constructor(input: string[][])
  constructor(input: string[][]) {
    this.map = input.map((row) => row.slice())
    this.maxHeight = this.map.length - 1
    this.maxWidth = this.map[0].length - 1
  }

  at(pos: Position): string {
    return this.map[pos.y][pos.x]
  }

  inBounds(pos: Position): boolean {
    return (
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x <= this.maxWidth &&
      pos.y <= this.maxHeight
    )
  }

  nextPositions(current: Position): Position[] {
    const steps = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ]
    return steps
      .map((step) => new Position(step.x + current.x, step.y + current.y))
      .filter((newPos) => this.inBounds(newPos))
  }
  validNextMoves(
    current: Position,
    validTest: (p1: Position, p2: Position) => boolean,
  ): Position[] {
    return this.nextPositions(current).filter((nextPos) =>
      validTest(current, nextPos),
    )
  }
}

class Queue<T extends { toString(): string }> {
  private queue: T[] = []
  private parents: { [str: string]: T | null } = {}

  enqueue(item: T, parent: T | null): void {
    // Only add to the queue if it is not already in the queue
    // Item is in or has been in the queue if it has an entry in 'parents'
    // We know that the first time a position is visited will be the shortest path to that point
    // So we don't ever need to visit a position more than once
    if (this.parents[item.toString()] !== undefined) {
      return
    }

    this.queue.push(item)
    this.parents[item.toString()] = parent
  }

  dequeue(): { item: T; parent: T | null } {
    if (this.queue.length !== 0) {
      const item = this.queue.shift() as T
      const parent = this.parents[item.toString()]
      return { item, parent }
    }

    throw new Error("Dequeue from empty queue")
  }

  allParents(pos: Position): string[] {
    let parent = this.parents[pos.toString()]
    const parents: string[] = []

    while (parent !== null) {
      if (parent === undefined) {
        throw new Error("Could not find parent path")
      }
      const parStr = parent.toString()
      parents.push(parStr)
      parent = this.parents[parStr]
    }

    return parents
  }

  size(): number {
    return this.queue.length
  }
}

class PosSet {
  set: Set<string> = new Set<string>()
  parents: { [curr: string]: string } = {}

  add(pos: Position, parent: Position | null): void {
    const str = pos.toString()
    const parStr = parent === null ? "" : parent.toString()

    if (parent && this.parents[parStr] === undefined) {
      throw new Error(
        "Adding regular element to PosSet that doesn't have a parent",
      )
    }

    this.parents[str] = parStr
    this.set.add(str)
  }

  has(pos: Position): boolean {
    return this.set.has(pos.toString())
  }

  allParents(pos: Position): string[] {
    if (!this.has(pos)) {
      throw new Error("Trying to find parents of position not in set")
    }
    const str = pos.toString()
    const parents: string[] = []
    let parent = this.parents[str]

    while (parent !== "") {
      if (parent === undefined) {
        throw new Error("Could not find parent path")
      }
      parents.push(parent)
      parent = this.parents[parent]
    }

    return parents
  }
}

const validStep = (currHeight: string, nextHeight: string): boolean => {
  return nextHeight.charCodeAt(0) - currHeight.charCodeAt(0) <= 1
}

const bfs = (
  map: Map,
  start: Position,
  isTarget: (pos: Position) => boolean,
  validTest: (p1: Position, p2: Position) => boolean,
): string[] | undefined => {
  const q = new Queue<Position>()
  q.enqueue(start, null)

  while (q.size()) {
    // Get the next search position
    const { item: curr } = q.dequeue()

    // If curr is the goal, return the list of parents
    if (isTarget(curr)) {
      return q.allParents(curr)
    }

    // Otherwise get the next positions that have not been visited and aren't about to be visited
    const nextPositions = map.validNextMoves(curr, validTest)

    // For each of the next valid positions, put them in the toVisit q
    nextPositions.forEach(pos => q.enqueue(pos, curr))
  }

  return undefined
}

const part1 = (rawInput: string) => {
  const { map, start, goal } = parseInput(rawInput)
  const goalStr = goal.toString()

  const path = bfs(
    map,
    start,
    (pos: Position) => pos.toString() === goalStr,
    (p1: Position, p2: Position) => validStep(map.at(p1), map.at(p2)),
  )

  return path?.length
}

const part2 = (rawInput: string) => {
  const { map, goal: newStart } = parseInput(rawInput)

  const path = bfs(
    map,
    newStart,
    (curr: Position) => map.at(curr) === "a",
    (p1: Position, p2: Position) => validStep(map.at(p2), map.at(p1)),
  )

  return path?.length
}

run({
  part1: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
        `,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
        `,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
