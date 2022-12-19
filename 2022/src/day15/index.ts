import run from "aocrunner"
import { Range } from "../utils/Range2.js"

const onlyTests = false

const TARGET_ROW_Y = onlyTests ? 10 : 2000000
const MAX_COORD = onlyTests ? 20 : 4000000

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
  const sbPairsByRow = parseInput(rawInput)
  let targetRow: Range[] = []

  for (const row in sbPairsByRow) {
    const rowPairs = sbPairsByRow[row]
    for (const { s, b } of rowPairs) {
      const sensorReach = manhattanDist(s, b)
      const distToTargetRow = Math.abs(TARGET_ROW_Y - s.y)
      const reachForThisRow = sensorReach - distToTargetRow

      // Skip if everything if the sensor can't reach
      if (distToTargetRow > sensorReach) {
        continue
      }

      // Make a range from s.x-reachForThisRow - s.x + reachForThisRow
      const sensorRowRange = new Range(
        s.x - reachForThisRow,
        s.x + reachForThisRow,
      )

      // Add sensor ranges to the target row, skipping beacons
      if (b.y !== TARGET_ROW_Y || !sensorRowRange.contains(b.x)) {
        targetRow = addRangeToList(targetRow, sensorRowRange)
      } else {
        if (s.x - reachForThisRow !== b.x) {
          const newRange = new Range(s.x - reachForThisRow, b.x - 1)
          targetRow = addRangeToList(targetRow, newRange)
        }
        if (s.x + reachForThisRow !== b.x) {
          const newRange = new Range(b.x + 1, s.x + reachForThisRow)
          targetRow = addRangeToList(targetRow, newRange)
        }
      }
    }
  }

  return targetRow.reduce((sum, range) => sum + range.size(), 0)
}

const addRangeToList = (list: Range[], range: Range): Range[] => {
  const sortedList = list.slice().sort((a, b) => a.start - b.start)
  const newList: Range[] = []
  let currRange = range

  for (const rangeFromList of sortedList) {
    const maybeJoined = currRange.add(rangeFromList)

    if (Array.isArray(maybeJoined)) {
      let rangeToPush
      ;[rangeToPush, currRange] = maybeJoined
      newList.push(rangeToPush)
    } else {
      currRange = maybeJoined
    }
  }

  newList.push(currRange)

  return newList
}

const part2 = (rawInput: string) => {
  const sbPairsByRow = parseInput(rawInput)
  const sensorCoverage: { [y: number]: Range[] } = {}

  for (const row in sbPairsByRow) {
    const rowPairs = sbPairsByRow[row]
    for (const { s, b } of rowPairs) {
      // console.log("s:", s, "b:", b)
      const sensorReach = manhattanDist(s, b)
      const y_start = Math.max(0, s.y - sensorReach)
      const y_end = Math.min(MAX_COORD, s.y + sensorReach)
      for (let y = y_start; y <= y_end; y++) {
        const distToTargetRow = Math.abs(y - s.y)
        const reachForThisRow = sensorReach - distToTargetRow

        const sensorRowRange = new Range(
          Math.max(s.x - reachForThisRow, 0),
          Math.min(s.x + reachForThisRow, MAX_COORD),
        )

        // console.log("y:", y, "Adding:", sensorRowRange, "to", sensorCoverage[y])
        sensorCoverage[y] = addRangeToList(
          sensorCoverage[y] || [],
          sensorRowRange,
        )
      }
      // console.log("Result:", sensorCoverage)
    }
  }

  // console.log(sensorCoverage)

  for (let y = 0; y <= MAX_COORD; y++) {
    if (sensorCoverage[y].length !== 1) {
      return (sensorCoverage[y][0].end + 1) * 4000000 + y
    }
  }

  throw new Error("got to end")
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
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: onlyTests,
})
