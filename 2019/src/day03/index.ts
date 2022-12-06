import run from "aocrunner"
import { Instruction, HorizontalLine, VerticalLine, Line, followInstruction, parseInstruction } from './instruction.js'

const parseInput = (rawInput: string): Instruction[][] => {
  const [rawWire1, rawWire2] = rawInput.split("\n").map(s => s.split(","))

  const wire1: Instruction[] = rawWire1.map(parseInstruction)
  const wire2: Instruction[] = rawWire2.map(parseInstruction)

  return [wire1, wire2]
}

type WireMap = {
  vert: {
    [x: number]: { line: VerticalLine, runningDist: number }
  }
  horiz: {
    [y: number]: { line: HorizontalLine, runningDist: number }
  }
}

const createMap = (instructions: Instruction[]): WireMap => {
  const wireMap: WireMap = {
    vert: {} as {[x: number]: { line: VerticalLine, runningDist: number }},
    horiz: {} as {[y: number]: { line: HorizontalLine, runningDist: number }}
  }

  const currentCoord: [number, number] = [0, 0]
  let runningDist = 0

  instructions.forEach(instruction => {
    // console.log("Instruction: ", instruction)
    const line = followInstruction(currentCoord, instruction)
    // console.log("Line: ", line)


    if (line.type === "vert") {
      wireMap.vert[currentCoord[0]] = {line, runningDist}
      currentCoord[1] = line.y.end
      runningDist += Math.abs(line.y.start - line.y.end)
    } else {
      wireMap.horiz[currentCoord[1]] = {line, runningDist}
      currentCoord[0] = line.x.end
      runningDist += Math.abs(line.x.start - line.x.end)
    }
  })
  // console.log("-----")

  // console.log("WireMap befor return: ")
  // console.log(wireMap)
  // console.log("-----")
  return wireMap
}

function findIntersections(w1: WireMap, w2: WireMap): Array<[number, number]> {
  const intersections: Array<[number, number]> = []
  Object.values(w1.vert).forEach(vline => {
    const start = Math.min(vline.line.y.start, vline.line.y.end)
    const end = Math.max(vline.line.y.start, vline.line.y.end)

    for (let y = start; y <= end; y++) {
      const hline = w2.horiz[y]
      // console.log("Comparing", vline, "to", hline)

      if (hline?.line.x.contains(vline.line.x)) {
        intersections.push([vline.line.x, y])
      }
    }
  })

  Object.values(w1.horiz).forEach(hline => {
    const start = Math.min(hline.line.x.start, hline.line.x.end)
    const end = Math.max(hline.line.x.start, hline.line.x.end)
    for (let x = start; x <= end; x++) {
      const vline = w2.vert[x]
      // console.log("Comparing", hline, "to", vline)

      if (vline?.line.y.contains(hline.line.y)) {
        // console.log("Intersection!")
        intersections.push([x, hline.line.y])
      }
    }
  })

  return intersections
}

function calcDist(int: [number, number], x: number, y: number) {
  return Math.abs(x - int[0]) + Math.abs(y - int[1])
}

function findIntersectionsWithDist(w1: WireMap, w2: WireMap): Array<{int: [number, number], dist: number}> {
  const intersections: Array<{int: [number, number], dist: number}> = []
  Object.values(w1.vert).forEach(vline => {
    const start = Math.min(vline.line.y.start, vline.line.y.end)
    const end = Math.max(vline.line.y.start, vline.line.y.end)

    for (let y = start; y <= end; y++) {
      const hline = w2.horiz[y]

      if (hline?.line.x.contains(vline.line.x)) {
        const int = [vline.line.x, y] as [number, number]
        const dist = hline.runningDist + vline.runningDist + calcDist(int, hline.line.x.start, vline.line.y.start)
        intersections.push({int, dist})
      }
    }
  })

  Object.values(w1.horiz).forEach(hline => {
    const start = Math.min(hline.line.x.start, hline.line.x.end)
    const end = Math.max(hline.line.x.start, hline.line.x.end)
    for (let x = start; x <= end; x++) {
      const vline = w2.vert[x]
      // console.log("Comparing", hline, "to", vline)

      if (vline?.line.y.contains(hline.line.y)) {
        const int = [x, hline.line.y] as [number, number]
        const dist = hline.runningDist + vline.runningDist + calcDist(int, hline.line.x.start, vline.line.y.start)
        intersections.push({int, dist})
      }
    }
  })

  return intersections
}
function manhattanDist(p1: [number, number], p2: [number, number]): number {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}

const part1 = (rawInput: string) => {
  const [wire1instructions, wire2instructions] = parseInput(rawInput)

  const wire1map = createMap(wire1instructions)
  const wire2map = createMap(wire2instructions)

  const intersections = findIntersections(wire1map, wire2map)
  // console.log(intersections)

  // console.log("Wire 1")
  // console.log("Horiz:")
  // console.log(wire1map.horiz)
  // console.log("Vert:")
  // console.log(wire1map.vert)
  // console.log("Wire 2")
  // console.log("Horiz:")
  // console.log(wire2map.horiz)
  // console.log("Vert:")
  // console.log(wire2map.vert)
  // return 'nope'
  const sortedDistances = intersections.map(int => manhattanDist([0,0], int)).sort((a, b) => a - b)
  // console.log(sortedDistances)
  return sortedDistances[0] || sortedDistances[1]
}

const part2 = (rawInput: string) => {
  const [wire1instructions, wire2instructions] = parseInput(rawInput)

  const wire1map = createMap(wire1instructions)
  const wire2map = createMap(wire2instructions)

  const intersections = findIntersectionsWithDist(wire1map, wire2map)
  const sortedDistances = intersections.map(int => int.dist).sort((a, b) => a - b)

  return sortedDistances[0] || sortedDistances[1]
}

run({
  part1: {
    tests: [
      {
        input: `
        R8,U5,L5,D3
        U7,R6,D4,L4
        `,
        expected: 6,
      },
      {
        input: `
        R75,D30,R83,U83,L12,D49,R71,U7,L72
        U62,R66,U55,R34,D71,R55,D58,R83
        `,
        expected: 159,
      },
      {
        input: `
        R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
        U98,R91,D20,R16,D67,R40,U7,R15,U6,R7
        `,
        expected: 135,
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
