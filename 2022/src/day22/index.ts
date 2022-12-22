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
  U
}

const parseInput = (rawInput: string) => {
  const [mapStr, dirsStr] = rawInput.split("\n\n")
  const map = mapStr.split("\n")
  const widest = Math.max(...map.map(row => row.length))
  map.forEach((row, i) => map[i] = row.padEnd(widest + 1, " ").padStart(widest + 2, " "))
  map.push(" ".repeat(widest + 2))
  map.unshift(" ".repeat(widest + 2))
  const dirs = [...dirsStr.matchAll(/\d+|R|L/g)].map(match => {
    if (!match) {
      throw new Error("didn't match")
    }
    return match[0]
  })
  return { map, dirs }
}

const turn = (f: Facing, turn: 'R' | 'L'): Facing => {
  return turn === 'R' ? (f + 1) % 4 : (((f - 1) % 4) + 4) % 4
}

const findStartingPoint = (map: string[]): Position => {
  return { r: 1, c: map[1].indexOf("."), facing: Facing.R }
}

const getNextSquare = (pos: Position, map: string[]): { pos: Position, square: string } => {
  const r_step = pos.facing === Facing.D ? 1 : pos.facing === Facing.U ? -1 : 0
  const c_step = pos.facing === Facing.R ? 1 : pos.facing === Facing.L ? -1 : 0

  let nextSquare: Position = { r: pos.r + r_step, c: pos.c + c_step, facing: pos.facing }
  if (map[nextSquare.r][nextSquare.c] === ' ') {
    console.log("Wrap around:", nextSquare)
    switch (pos.facing) {
      case Facing.R:
        nextSquare = { r: nextSquare.r, c: map[nextSquare.r].search(/#|\./), facing: nextSquare.facing }
        break
      case Facing.L:
        nextSquare = { r: nextSquare.r, c: map[nextSquare.r].split('').reverse().join('').search(/#|\./), facing: nextSquare.facing }
        break
      case Facing.U:
        nextSquare = { r: firstMapSpot(map, nextSquare.c, 'bottom'), c: nextSquare.c, facing: nextSquare.facing }
        break
      case Facing.D:
        nextSquare = { r: firstMapSpot(map, nextSquare.c, 'top'), c: nextSquare.c, facing: nextSquare.facing }
        break
    }
    console.log("After wrap:", nextSquare)
  }


  return { pos: nextSquare, square: map[nextSquare.r][nextSquare.c] }
}

const firstMapSpot = (map: string[], col: number, start: 'top' | 'bottom'): number => {
  if (start === 'top') {
    for (let i = 0; i < map.length; i++) {
      if (map[i][col] === '.' || map[i][col] === "#") {
        return col
      }
    }
  } else {
    for (let i = map.length - 1; i >= 0; i--) {
      if (map[i][col] === '.' || map[i][col] === "#") {
        return col
      }
    }
  }

  throw new Error("couldn't find a start point")
}

const nextPosition = (dir: string, pos: Position, map: string[]): Position => {
  if (dir === 'R' || dir === 'L') {
    return { ...pos, facing: turn(pos.facing, dir) }
  } else {
    const steps = parseInt(dir)
    if (isNaN(steps)) { throw new Error("bad next dir") }

    let currR = pos.r
    let currC = pos.c

    loop:
    for (let i = 0; i < steps; i++) {
      const { pos: nextPos, square: nextSquare } = getNextSquare({ r: currR, c: currC, facing: pos.facing }, map)
      console.log("nextPost:", nextPos, "nextSquare:", nextSquare)
      switch (nextSquare) {
        case '.':
          currR = nextPos.r
          currC = nextPos.c
          break
        case '#':
          break loop
      }
    }
    return { r: currR, c: currC, facing: pos.facing }
  }
}

const part1 = (rawInput: string) => {
  const { map, dirs } = parseInput(rawInput)
  let pos = findStartingPoint(map)
  console.log(dirs)
  console.log(map)

  console.log(pos)
  dirs.forEach(dir => {
    pos = nextPosition(dir, pos, map)
    console.log(pos)
  })

  return (1000 * pos.r) + (4 * pos.c) + pos.facing 
}
/*
  *To finish providing the password to this strange input device, you need to
determine numbers for your final row, column, and facing as your final position
  appears from the perspective of the original map. Rows start from 1 at the
top and count downward; columns start from 1 at the left and count rightward.
  (In the above example, row 1, column 1 refers to the empty space with no tile
   on it in the top-left corner.) Facing is 0 for right (>), 1 for down (v), 2
     for left (<), and 3 for up (^). The final password is the sum of 1000
       times the row, 4 times the column, and the facing.

In the above example, the final row is 6, the final column is 8, and the final
   facing is 0. So, the final password is 1000 * 6 + 4 * 8 + 0: 6032.
  */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}


run({
  part1: {
    tests: [
      {
        input:
          `        ...#
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: true,
})
