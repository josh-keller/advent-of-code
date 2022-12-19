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
    // console.log(chamber.toString())
    // console.log("Highest Rock:", chamber.highestRock)
    // console.log("~~~~~~~~~~~~~~~~~~~~~~\n\n")
  }

  return chamber.highestRock
}

const part2 = (rawInput: string) => {
  const wind = new WindGenerator(rawInput)
  const chamber = new Chamber()

  for (let i = 0; i < 1000000; i++) {
    const rock = new Rock(i % 5, chamber)
    rock.fall(wind)
    console.log(chamber.highestRock / i)
  }

  return chamber.highestRock
  const input = parseInput(rawInput)

  return
}

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
