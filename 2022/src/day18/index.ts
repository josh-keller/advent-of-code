import run from "aocrunner"

class Point3D {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  toString(): string {
    return `${this.x},${this.y},${this.z}`
  }
}

const parseInput = (rawInput: string) => {
  const cubes = new Map<string, Point3D>()
  rawInput.split("\n").forEach((str) => {
    const [x, y, z] = str.split(",").map((s) => parseInt(s))
    const cube = new Point3D(x, y, z)
    cubes.set(cube.toString(), cube)
  })

  return cubes
}

const part1 = (rawInput: string) => {
  const cubes = parseInput(rawInput)
  let sides = 0

  for (const [, cube] of cubes) {
    sides += 6 - neighbors(cube).reduce((s, n) => s + (cubes.has(n.toString()) ? 1 : 0), 0)
  }

  return sides
}

const neighbors = (cube: Point3D): Point3D[] =>
  neighborMods.map((mod) => add(cube, mod))

const add = (c1: Point3D, c2: Point3D): Point3D => new Point3D(
  c1.x + c2.x,
  c1.y + c2.y,
  c1.z + c2.z,
)

const neighborMods: Point3D[] = [
  { x: -1, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: 0, z: -1 },
  { x: 0, y: 0, z: 1 },
]

type Bounds = {
  x_min: number
  y_min: number
  z_min: number
  x_max: number
  y_max: number
  z_max: number
}

const getBounds = (cubes: Map<string, Point3D>): Bounds => {
  let x_min = Infinity,
    x_max = -Infinity,
    y_min = Infinity,
    y_max = -Infinity,
    z_min = Infinity,
    z_max = -Infinity

  for (const [, cube] of cubes) {
    x_min = Math.min(x_min, cube.x)
    y_min = Math.min(y_min, cube.y)
    z_min = Math.min(z_min, cube.z)
    x_max = Math.max(x_max, cube.x)
    y_max = Math.max(y_max, cube.y)
    z_max = Math.max(z_max, cube.z)
  }

  return { x_min: x_min - 1, y_min: y_min - 1, z_min: z_min - 1, x_max: x_max + 1, y_max: y_max + 1, z_max: z_max + 1 }
}

const outOfBounds = (cube: Point3D, bounds: Bounds): boolean => {
  return (
    cube.x < bounds.x_min ||
    cube.x > bounds.x_max ||
    cube.y < bounds.y_min ||
    cube.y > bounds.y_max ||
    cube.z < bounds.z_min ||
    cube.z > bounds.z_max
  )
}

const bfs = (cubes: Map<string, Point3D>, bounds: Bounds): number => {
  const to_visit = [new Point3D(bounds.x_min, bounds.y_min, bounds.z_min)]
  const visited = new Map<string, Point3D>()
  let exposedFaces = 0

  while (to_visit.length > 0) {
    const currCube = to_visit.pop() as Point3D
    const currStr = currCube.toString()
    // If we've already visited or it's out of bounds, skip
    if (visited.has(currStr) || outOfBounds(currCube, bounds)) {
      continue
    }

    // If the cube is lava, add to exposed faces
    // However, don't add to visited, because we may want to visit again
    // If we can reach this cube from another space that hasn't been visited, that's another exposed face
    // Else (it's not lava) and we can mark it as visited, and add its neighbors to to_visit
    if (cubes.has(currStr)) {
      exposedFaces++
    } else {

      visited.set(currStr, currCube)
      to_visit.push(...neighbors(currCube))
    }
  }

  return exposedFaces
}

const part2 = (rawInput: string) => {
  const cubes = parseInput(rawInput)
  const bounds = getBounds(cubes)
  return bfs(cubes, bounds)
}

run({
  part1: {
    tests: [
      {
        input: `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
