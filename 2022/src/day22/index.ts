import run from "aocrunner"

interface Position {
  r: number
  c: number
  facing: Facing
}

enum Facing {
  R,
  D,
  L,
  U,
}

const parseInput = (rawInput: string) => {
  const [mapStr, dirsStr] = rawInput.split("\n\n")
  const map = mapStr.split("\n")
  const widest = Math.max(...map.map((row) => row.length))
  map.forEach(
    (row, i) =>
      (map[i] = row.padEnd(widest + 1, " ").padStart(widest + 2, " ")),
  )
  map.push(" ".repeat(widest + 2))
  map.unshift(" ".repeat(widest + 2))
  const dirs = [...dirsStr.matchAll(/\d+|R|L/g)].map((match) => {
    if (!match) {
      throw new Error("didn't match")
    }
    return match[0]
  })
  return { map: map.map((row) => row.split("")), dirs }
}

const turn = (f: Facing, turn: "R" | "L"): Facing => {
  return turn === "R" ? (f + 1) % 4 : (((f - 1) % 4) + 4) % 4
}

const findStartingPoint = (map: string[][]): Position => {
  return { r: 1, c: map[1].indexOf("."), facing: Facing.R }
}

const getNextSquare = (
  pos: Position,
  map: string[][],
  part: 1 | 2,
): { pos: Position; square: string } => {
  const r_step = pos.facing === Facing.D ? 1 : pos.facing === Facing.U ? -1 : 0
  const c_step = pos.facing === Facing.R ? 1 : pos.facing === Facing.L ? -1 : 0

  let nextSquare: Position = {
    r: pos.r + r_step,
    c: pos.c + c_step,
    facing: pos.facing,
  }

  const wrapFunc = part === 1 ? wrapAround : wrapAroundCube


  if (map[nextSquare.r][nextSquare.c] === " ") {
    nextSquare = wrapFunc(nextSquare, map)
  }

  return { pos: nextSquare, square: map[nextSquare.r][nextSquare.c] }
}

const wrapAroundCube = (pos: Position, map: string[][]): Position => {
  let c: number = pos.c
  let r: number = pos.r
  // console.log("map length:", map.length)
  const faceSize = (map.length - 2) / 3
  switch (pos.facing) {
    case Facing.U:
      r += 1
      // Top of A
      if (r === 1) {
        return { r: faceSize + 1, c: 3 * faceSize - c + 1, facing: Facing.D }
      }
      // Top of left arm
      if (r === faceSize + 1 && c <= faceSize) {
        return { r: 0, c: 3 * faceSize + 1 - c, facing: Facing.D }
      }
      // Top of left arm - second square
      if (r === faceSize + 1 && c > faceSize && c <= 2 * faceSize) {
        return { r: c - faceSize, c: 2 * faceSize + 1, facing: Facing.R }
      }
      if (r === 2 * faceSize + 1) {
        return { r: 5 * faceSize - c + 1, c: faceSize * 3, facing: Facing.L }
      }
      console.log(r, ",", c)
      throw new Error("can't wrap U")
    case Facing.D:
      r -= 1
      if (r === 2 * faceSize && c <= faceSize) {
        return { r: 3 * faceSize, c: 3 * faceSize + 1 - c, facing: Facing.U}
      }
      if (r === 2 * faceSize && c > faceSize && c <= 2 * faceSize) {
        return { r: 4 * faceSize - c + 1, c: 2 * faceSize + 1, facing: Facing.R}
      }
      if (r === 3 * faceSize && c > 2 * faceSize && c <= 3 * faceSize) {
        return { r: 2 * faceSize, c: 3 * faceSize - c + 1, facing: Facing.U}
      }
      if (r === 3 * faceSize && c > 3 * faceSize && c <= 4 * faceSize) {
        return { r: 5 * faceSize - c + 1, c: 1, facing: Facing.R}
      }
      throw new Error("can't wrap D")
    case Facing.R:
      c -= 1
      if (c === 3 * faceSize && r <= faceSize) {
        return { r: 3 * faceSize + 1 - r, c: 4 * faceSize, facing: Facing.L}
      }
      if (c === 3 * faceSize && r > faceSize && r <= 2 * faceSize) {
        return { r: 2 * faceSize + 1, c: 5 * faceSize + 1 - r, facing: Facing.D}
      }
      if (c === 4 * faceSize && r > 2 * faceSize && r <= 3 * faceSize) {
        return { r: 3 * faceSize - r + 1, c: 3 * faceSize, facing: Facing.L}
      }
      throw new Error("can't wrap R")
    case Facing.L:
      c += 1
      if (c === 2 * faceSize + 1 && r <= faceSize) {
        return { r: faceSize + 1, c: faceSize + r, facing: Facing.D}
      }
      if (c === 1 && r > faceSize && r <= 2 * faceSize) {
        return { r: 3 * faceSize, c: 5 * faceSize + 1 - r, facing: Facing.U}
      }
      if (c === 2 * faceSize + 1 && r > 2 * faceSize && r <= 3 * faceSize) {
        return { r: 2 * faceSize, c: 4 * faceSize + 1 - r, facing: Facing.U}
      }

      throw new Error("can't wrap L")
  }
  return { r, c, facing: pos.facing }
}

const wrapAround = (pos: Position, map: string[][]): Position => {
  let c: number = pos.c
  let r: number = pos.r
  switch (pos.facing) {
    case Facing.R:
      // Return the first position in the same row that's not a space
      c = map[pos.r].findIndex((square) => square !== " ")
      break
    case Facing.L:
      // Return the last position in the same row that's not a space
      c = map[pos.r].lastIndexOf(".")
      c = c === -1 ? map[pos.r].lastIndexOf("#") : c
      break
    case Facing.U:
      // Return the last position in the same col that's not a space
      for (let i = map.length - 2; i > 0; i--) {
        if (map[i][c] !== " ") {
          r = i
          break
        }
      }
      break
    case Facing.D:
      // Return the first position in the same col that's not a space
      for (let i = 1; i < map.length - 1; i++) {
        if (map[i][c] !== " ") {
          r = i
          break
        }
      }
      break
  }
  return { r, c, facing: pos.facing }
}

const nextPosition = (
  dir: string,
  pos: Position,
  map: string[][],
  part: 1 | 2 = 1
): Position => {
  if (dir === "R" || dir === "L") {
    return { ...pos, facing: turn(pos.facing, dir) }
  } else {
    const steps = parseInt(dir)
    if (isNaN(steps)) {
      throw new Error("bad next dir")
    }

    let currR = pos.r
    let currC = pos.c
    let currF = pos.facing

    loop: for (let i = 0; i < steps; i++) {
      const { pos: nextPos, square: nextSquare } = getNextSquare(
        { r: currR, c: currC, facing: currF },
        map,
        part
      )
      switch (nextSquare) {
        case ".":
          currR = nextPos.r
          currC = nextPos.c
          currF = nextPos.facing
          break
        case "#":
          break loop
      }
    }
    return { r: currR, c: currC, facing: currF }
  }
}

const mapToStr = (map: string[][]): string => {
  return map.map((row) => row.join("")).join("\n")
}

const part1 = (rawInput: string) => {
  const { map, dirs } = parseInput(rawInput)
  let pos = findStartingPoint(map)

  dirs.forEach(dir => {
    pos = nextPosition(dir, pos, map)
  })

  return 1000 * pos.r + 4 * pos.c + pos.facing
}
const part2 = (rawInput: string) => {
  const { map, dirs } = parseInput(rawInput)
  let pos = findStartingPoint(map)

  dirs.forEach(dir => {
    pos = nextPosition(dir, pos, map, 2)
  })

  console.log(pos)

  return 1000 * pos.r + 4 * pos.c + pos.facing
}

run({
  part1: {
    tests: [
      {
        input: `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
        expected: 6032,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
        expected: 5031,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
})
