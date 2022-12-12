import run from "aocrunner"

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

const findPosition = (map: string[][], target: string): Position => {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].findIndex((a) => a === target)
    if (x !== -1) {
      return new Position(x, y)
    }
  }

  throw new Error("Cannot find position")
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
  at(pos: Position): string {
    return this.map[pos.y][pos.x]
  }
}

const validNextMoves = (map: Map, current: Position): Position[] => {
  return map.nextPositions(current).filter(
    (nextPos) =>
      validStep(map.at(current), map.at(nextPos))
  )
}

const validStep = (currHeight: string, nextHeight: string): boolean => {
  return nextHeight.charCodeAt(0) - currHeight.charCodeAt(0) <= 1
}

class Queue<T extends { toString(): string }> {
  private queue: T[] = []
  private parents: { [str: string]: T | null } = {}

  enqueue(item: T, parent: T | null): void {
    this.queue.push(item)
    this.parents[item.toString()] = parent
  }

  dequeue(): {item: T, parent: T | null} {
    if (this.queue.length !== 0) {
      const item = this.queue.shift()as T
      const parent = this.parents[item.toString()]
      return {item, parent}
    }

    throw new Error("Dequeue from empty queue")
  }

  size(): number {
    return this.queue.length
  }
}

class PosSet {
  set: Set<string> = new Set<string>()
  parents: { [curr: string]: string } = {}

  add(pos: Position, parent: Position | null): void {
    // console.log("Set:", this.set)
    // console.log("Parents:", this.parents)
    // console.log("Adding:", pos, parent)
    const str = pos.toString()
    const parStr = parent === null ? '' : parent.toString()

    if (parent && this.parents[parStr] === undefined) {
      throw new Error("Adding regular element to PosSet that doesn't have a parent")
    }

    this.parents[str] = parStr
    this.set.add(str)
  }

  has(pos: Position): boolean {
    return this.set.has(pos.toString())
  }

  allParents(pos: Position): string[] {
    if (!this.has(pos)) { throw new Error("Trying to find parents of position not in set") }
    const str = pos.toString()
    const parents: string[] = []
    let parent = this.parents[str]

    while (parent !== '') {
      if (parent === undefined) { throw new Error("Could not find parent path") }
      parents.push(parent)
      parent = this.parents[parent]
    }

    return parents
  }
}

const bfs = (map: Map, start: Position, goal: Position): string[] | undefined => {
  const q = new Queue<Position>()
  const visited = new PosSet()
  const toVisit = new Set<string>()
  q.enqueue(start, null)
  let curr: Position
  let parent: Position | null

  while (q.size()) {
    // Get the next search position
    ({item: curr, parent} = q.dequeue())
    // Add this position to visited
    console.log("Trying:", curr)
    visited.add(curr, parent)
    // If curr is the goal, return the list of parents
    if (curr.toString() === goal.toString()) {
      console.log("Found!")
      return visited.allParents(curr)
    }
    
    const nextPositions = validNextMoves(map, curr).filter(pos => !visited.has(pos) && !toVisit.has(pos.toString()))
    parent = curr

    nextPositions.forEach(pos => {
      q.enqueue(pos, parent)
      toVisit.add(pos.toString())
    })
    console.log("Next:", nextPositions, "Qsize:", q.size())
  }

  return undefined
}

const parseInput = (rawInput: string) => {
  const rawMap = rawInput.split("\n").map((line) => line.split(""))
  let start = new Position(-1, -1)
  let goal = new Position(-1, -1)

  for (let r = 0; r < rawMap.length; r++) {
    for (let c = 0; c < rawMap[0].length; c++) {
      if (rawMap[r][c] === 'S') {
        start = new Position(c, r)
        rawMap[r][c] = 'a'
      }

      if (rawMap[r][c] === 'E') {
        goal = new Position(c, r)
        rawMap[r][c] = 'z'
      }

      if (start.x !== -1 && goal.x !== -1) {
        return { map: new Map(rawMap), start, goal }
      }
    }
  }

  throw new Error("Failed to parse")
}

const part1 = (rawInput: string) => {
  const {map, start, goal} = parseInput(rawInput)

  const path = bfs(map, start, goal)
  console.log(path)

  return path?.length
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
