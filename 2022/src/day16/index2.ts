import run from "aocrunner"

class Valve {
  name: string
  flowRate: number
  tunnels: string[]
  valveOpen = false

  constructor(
    name: string,
    flowRate: number | string,
    tunnels: string[] | string,
  ) {
    this.name = name
    this.flowRate = typeof flowRate === "string" ? parseInt(flowRate) : flowRate
    this.tunnels = Array.isArray(tunnels)
      ? tunnels.slice()
      : tunnels.split(", ")
  }

  validMoves(): string[] {
    return this.valveOpen && this.flowRate !== 0
      ? this.tunnels
      : this.tunnels.concat(this.name)
  }

  open(): Valve {
    const copy = new Valve(this.name, this.flowRate, this.tunnels)
    copy.valveOpen = true
    return copy
  }
}

class Path {
  visited: string[]
  minutesRemaining: number
  pressureReleased: number

  constructor(visited: string[], minutesRemaining = 30, pressureReleased = 0) {
    this.visited = visited.slice()
    this.minutesRemaining = minutesRemaining
    this.pressureReleased = pressureReleased
  }

  next(nextValve: Valve): Path {
    let pressureReleased = this.pressureReleased
    if (nextValve.name === this.visited[this.visited.length - 1]) {
      pressureReleased += nextValve.flowRate
    }

    return new Path(
      this.visited.concat(nextValve.name),
      this.minutesRemaining - 1,
      pressureReleased,
    )
  }
}

type ValveGraph = { [valveName: string]: Valve }

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const regex =
    /Valve (?<valveName>[A-Z]{2}) has flow rate=(?<flowRate>\d+); tunnels? leads? to valves? (?<tunnelList>.+)/
  const valves: ValveGraph = {}
  lines.forEach((line) => {
    const matchedLine = line.match(regex)
    if (
      !matchedLine?.groups ||
      !matchedLine.groups.flowRate ||
      !matchedLine.groups.valveName ||
      !matchedLine.groups.tunnelList
    ) {
      throw new Error(`Line does not match regex`)
    }
    const { valveName, flowRate, tunnelList } = matchedLine.groups
    valves[valveName] = new Valve(valveName, flowRate, tunnelList)
  })

  return valves
}

const findAllPaths = (
  valveGraph: ValveGraph,
  starting: string,
  pathSoFar: Path,
): Path[] => {
  if (pathSoFar.minutesRemaining < 0) {
    throw new Error("Negative minutes!")
  }

  if (pathSoFar.minutesRemaining === 0) {
    console.log("Found a path!")
    console.log(pathSoFar)
    return [pathSoFar]
  }

  const allPaths: Path[] = []
  const currentValve = valveGraph[starting]

  if (currentValve === undefined) {
    throw new Error("Starting not in valve graph")
  }

  for (const nextValveName of currentValve.validMoves()) {
    const nextValveGraph =
      nextValveName === currentValve.name
        ? { ...valveGraph }
        : { ...valveGraph, [currentValve.name]: currentValve.open() }

    const nextPath = pathSoFar.next(nextValveGraph[nextValveName])
    allPaths.concat(findAllPaths(nextValveGraph, nextValveName, nextPath))
  }

  return allPaths
}

const part1 = (rawInput: string) => {
  const valveGraph = parseInput(rawInput)
  const allPaths = findAllPaths(valveGraph, "AA", new Path(["AA"]))
  const sortedPaths = allPaths.sort(
    (a, b) => b.pressureReleased - a.pressureReleased,
  )
  return sortedPaths[0]
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
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`,
        expected: 364,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
        `,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
