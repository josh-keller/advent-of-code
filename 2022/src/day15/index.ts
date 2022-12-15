import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const regex =
    /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/
  const pairs = lines.map((line) => {
    const matchedLine = line.match(regex)
    return {
      s: {
        x: parseInt(matchedLine?.groups?.sx as string),
        y: parseInt(matchedLine?.groups?.sy as string),
      },
      b: {
        x: parseInt(matchedLine?.groups?.bx as string),
        y: parseInt(matchedLine?.groups?.by as string),
      },
    }
  })

  const pairMap: { [row: number]: { s: Point; b: Point }[] } = {}
  pairs.forEach(
    (pair) =>
      (pairMap[pair.s.y] = pairMap[pair.s.y]
        ? pairMap[pair.s.y].concat(pair)
        : [pair]),
  )
  return pairMap
}

interface Point {
  x: number
  y: number
}

const manhattanDist = (p1: Point, p2: Point): number =>
  Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)

const part1 = (rawInput: string) => {
  // const TARGET_ROW_Y = 10
  const TARGET_ROW_Y = 2000000
  const sbPairsByRow = parseInput(rawInput)
  let minx = Infinity,
    maxx = -Infinity,
    miny = Infinity,
    maxy = -Infinity
  let maxDist = 0

  Object.values(sbPairsByRow).forEach((row) => {
    row.forEach(({ s, b }) => {
      minx = Math.min(minx, s.x, b.x)
      miny = Math.min(miny, s.y, b.y)
      maxx = Math.max(maxx, s.x, b.x)
      maxy = Math.max(maxy, s.y, b.y)
      maxDist = Math.max(maxDist, manhattanDist(s, b))
    })
  })

  // const targetRow: {[x: number]: 'B'|'#' } = {}
  const targetRow = new Set<number>()

  for (const row in sbPairsByRow) {
    const rowPairs = sbPairsByRow[row]
    for (const { s, b } of rowPairs) {
      const sensorReach = manhattanDist(s, b)
      const distToTargetRow = Math.abs(TARGET_ROW_Y - s.y)
      const reachForThisRow = sensorReach - distToTargetRow

      // console.log("s:", s, "b:", b)
      // console.log("sensorReach:", sensorReach, "distToTarget:", distToTargetRow)
      // console.log("rowReach:", reachForThisRow)
      //
      if (b.y === TARGET_ROW_Y) {
        targetRow.add(b.x)
        // targetRow[b.x] = "B"
      }

      // Skip if everything if the sensor can't reach
      if (distToTargetRow > sensorReach) {
        continue
      }

      for (let x = s.x - reachForThisRow; x <= s.x + reachForThisRow; x++) {
        // Skip beacon in the target row
        if (x === b.x) {
          continue
        }
        targetRow.add(x)
      }
    }
  }

  // console.log("Target Row:", targetRow)
  return targetRow.size
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
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
        `,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
        `,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
