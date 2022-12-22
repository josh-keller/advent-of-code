import run from "aocrunner"

class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y)
  }

  move(other: Point): Point {
    this.x += other.x
    this.y += other.y
    return this
  }
}

class Chamber {
  leftwall = 0
  rightwall = 8
  floor = 0
  highestRock = 0
  private rocks: { [column: number]: boolean[] } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  }

  topShape(): string {
    const cols = Object.values(this.rocks)
    const min = Math.min(...cols.map(col => col.length))
    return cols.map(col => (col.length - min).toString()).join(",")
  }

  placeRocks(ps: Point[]) {
    // console.log("Placing: ", ps)
    ps.forEach(p => this.rocks[p.x][p.y] = true)
    this.highestRock = Math.max(...Object.values(this.rocks).map(r => r.length - 1))
  }

  hasRock(p: Point): boolean {
    if (p.x <= this.leftwall || p.x >= this.rightwall || p.y <= this.floor) {
      return true
    }

    return this.rocks[p.x][p.y]
  }

  toString() {
    const rows = ["|.......|", "|.......|","|.......|","|.......|",]
    for (let r = this.highestRock; r > this.floor; r--) {
      const rowRocks = ["|"]
      for (let c = 1; c <= 7; c++) {
        rowRocks.push(this.rocks[c][r] ? "#" : ".")
      }
      rowRocks.push("|")
      rows.push(rowRocks.join(""))
    }

    rows.push("+-------+")

    return rows.join("\n")
  }
}

enum RockType {
  flat,
  plus,
  ell,
  tall,
  square,
}

const rockStarts = Object.freeze([
  Object.freeze([
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(3, 0),
  ]),
  Object.freeze([
    new Point(0, 1),
    new Point(1, 1),
    new Point(2, 1),
    new Point(1, 0),
    new Point(1, 2),
  ]),
  Object.freeze([
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(2, 1),
    new Point(2, 2),
  ]),
  Object.freeze([
    new Point(0, 0),
    new Point(0, 1),
    new Point(0, 2),
    new Point(0, 3),
  ]),
  Object.freeze([
    new Point(0, 0),
    new Point(1, 0),
    new Point(0, 1),
    new Point(1, 1),
  ]),
])

const left = Object.freeze(new Point(-1, 0))
const right = Object.freeze(new Point(1, 0))
const down = Object.freeze(new Point(0, -1))

class WindGenerator {
  windPattern: string
  idx = 0

  constructor(windString: string) {
    if (windString.match(/[^><]/)) {
      throw new Error("Invalid character in windString")
    }

    this.windPattern = windString
  }

  next(): Point {
    const idx = this.idx
    this.idx = (this.idx + 1) % this.windPattern.length
    return this.windPattern[idx] === '<' ? left : right
  }
}


class Rock {
  points: Point[]
  chamber: Chamber
  static startingCol = 3

  constructor(type: RockType, chamber: Chamber) {
    const startingPoint = new Point(Rock.startingCol, chamber.highestRock + 4)
    this.points = rockStarts[type].map((point) => point.add(startingPoint))
    this.chamber = chamber
  }

  fall(gusts: WindGenerator) {
    // console.log("Starting rock:", this.points)
    while (!this.fallRound(gusts.next())) {
      continue
    }

    // console.log("About to place:", this.points)
    this.chamber.placeRocks(this.points)
  }
  
  fallRound(windDirection: Point): boolean {
    // Move left
    let nextPoints = this.points.map(point => point.add(windDirection))
    // Check
    if (!nextPoints.some(point => this.chamber.hasRock(point))) {
      this.points = nextPoints
    }

    // Move down
    nextPoints = this.points.map(point => point.add(down))
    // Check
    if (nextPoints.some(point => this.chamber.hasRock(point))) {
      return true
    } else {
      this.points = nextPoints
      return false
    }
  }
}

const parseInput = (rawInput: string) => rawInput

const part1 = (rawInput: string) => {
  const wind = new WindGenerator(rawInput)
  const chamber = new Chamber()

  for (let i = 0; i < 2022; i++) {
    const rock = new Rock(i % 5, chamber)
    rock.fall(wind)
  }

  return chamber.highestRock
}

const part2 = (rawInput: string) => {
  const wind = new WindGenerator(rawInput)
  const length = wind.windPattern.length
  const chamber = new Chamber()
  // i%length-i%5-topShape
  const memo = new Map<string, {i: number, height: number}>()
  let heightDiff = 0
  let rockDiff = 0
  let startingHeight = 0
  let startingRock = 0
  let toAdd = 0
  let firstOccurrence: {i:number, height: number}

  for (let i = 0; i < 1000000; i++) {
    const rock = new Rock(i % 5, chamber)
    rock.fall(wind)
    const key = `${i%length}-${i%5}-${chamber.topShape()}`
    if (memo.has(key)) {
      const m = memo.get(key)
      if (!m) { throw new Error("not in memo") }
      firstOccurrence = m
      startingHeight = chamber.highestRock
      startingRock = i
      heightDiff = chamber.highestRock - firstOccurrence.height
      rockDiff = i - firstOccurrence.i
      break
    } else {
      memo.set(key, {i, height: chamber.highestRock })
    }
  }

  if (!startingRock || !rockDiff || !heightDiff || !startingHeight) { throw new Error("undefined") }

  let r=0
  for (r = startingRock; r < 1000000000000; r += rockDiff) {
    startingHeight += heightDiff
  }
  r -= rockDiff

  console.log("R:", r, "H:", startingHeight)
  const diffToEnd = (1000000000000 - r)
  console.log("diff: ", diffToEnd)
  memo.forEach(({i, height}) => { if (i === (firstOccurrence.i + diffToEnd)) { toAdd = height - firstOccurrence.height }})
  console.log("to add:", toAdd)

  return startingHeight + toAdd
}
// Need to know:
//  - imod, currRock, topShape
//  - Shape of the top
//  - wind index
//  - height (difference between times)

run({
  part1: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
