import run from "aocrunner"

type Marker = "." | "o" | "#"

class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Grid {
  columns: {
    [col: number]: Marker[]
  } = {}
  minX: number | undefined
  maxX: number | undefined
  maxY = 0

  addRock(p1: Point, p2: Point | undefined) {
    if (p2 === undefined) {
      p2 = p1
    }
    const [xStart, xEnd] = p1.x < p2.x ? [p1.x, p2.x] : [p2.x, p1.x]
    const [yStart, yEnd] = p1.y < p2.y ? [p1.y, p2.y] : [p2.y, p1.y]

    if (!this.minX || xStart < this.minX) {
      this.minX = xStart
    }

    if (!this.maxX || xEnd > this.maxX) {
      this.maxX = xEnd
    }

    if (yEnd + 2 > this.maxY) {
      this.maxY = yEnd + 2
    }

    for (let x = xStart; x <= xEnd; x++) {
      if (!this.columns[x]) {
        this.columns[x] = []
      }

      for (let y = this.columns[x].length; y < yStart; y++) {
        this.columns[x][y] = "."
      }

      for (let y = yStart; y <= yEnd; y++) {
        this.columns[x][y] = "#"
      }
    }
  }

  drawSand(p1: Point) {
    const last_y = this.columns[p1.x].length
    for (let y = last_y; y < p1.y; y++) {
      this.columns[p1.x][y] = "."
    }

    this.columns[p1.x][p1.y] = "o"
  }

  toString(): string {
    const x_start =
      Math.min(...Object.keys(this.columns).map((key) => parseInt(key))) - 1
    const x_end =
      Math.max(...Object.keys(this.columns).map((key) => parseInt(key))) + 1
    const y_end =
      Math.max(
        ...Object.keys(this.columns).map(
          (key) => this.columns[parseInt(key)].length,
        ),
      ) + 2

    const output_arr: string[] = []
    for (let y = 0; y < y_end; y++) {
      const curr_line: string[] = [y.toString().padStart(3, "0") + ":"]
      for (let x = x_start; x <= x_end; x++) {
        const point = !this.columns[x] ? "_" : this.columns[x][y] || "_"
        curr_line.push(point)
      }
      output_arr.push(curr_line.join(""))
    }

    return output_arr.join("\n")
  }

  dropSand(start: Point): boolean {
    //     - new grain of sand at starting ;point
    let x = start.x
    let y = start.y

    if (this.columns[x][y] != ".") {
      throw new Error("Spot for sand is not empty")
    }

    while (true) {
      if (this.columns[x]?.length <= y) {
        return false
      }
      const fall_to =
        this.columns[x].slice(y).findIndex((square) => square != ".") + y - 1
      // There was no empty space below
      if (fall_to === -1) {
        return false
      }

      // If there is no column to the left, the sand will fall
      if (!this.columns[x - 1]) {
        return false
      }
      const down_left = this.columns[x - 1][fall_to + 1]
      if (down_left === "." || down_left === undefined) {
        x = x - 1
        y = fall_to + 1
        continue
      }

      if (!this.columns[x + 1]) {
        return false
      }
      const down_right = this.columns[x + 1][fall_to + 1]
      if (down_right === "." || down_right === undefined) {
        x = x + 1
        y = fall_to + 1
        continue
      }

      // If it gets here, it is resting
      this.drawSand(new Point(x, fall_to))
      return true
    }
  }
}

const parseInput = (rawInput: string) => {
  const inputLines = rawInput.split("\n")
  const rawPoints = inputLines.map((line) => line.split(" -> "))
  const lines = rawPoints.map((list) =>
    list.map((ptStr) => {
      const p_arr = ptStr.split(",").map((s) => parseInt(s))
      if (p_arr.length !== 2) {
        throw new Error("Parsing Error!")
      }
      return new Point(...(p_arr as [number, number]))
    }),
  )

  const grid = new Grid()
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      grid.addRock(line[i], line[i + 1])
    }
  }

  return grid
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  let count = 0

  while (grid.dropSand(new Point(500, 0))) {
    count++
  }

  return count
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  const floorY = grid.maxY

  if (grid.minX === undefined || grid.maxX === undefined) {
    throw new Error("min or max is undefined")
  }

  let count = 0

  while (true) {
    try {
      if (!grid.dropSand(new Point(500, 0))) {
        // If sand falls off, add more floor
        grid.addRock(
          new Point(grid.minX - 10, floorY),
          new Point(grid.maxX + 10, floorY),
        )
        continue
      }
    } catch {
      return count
    }
    count++
  }

  // Should never reach here
  return -1
}

run({
  part1: {
    tests: [
      {
        input: `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
