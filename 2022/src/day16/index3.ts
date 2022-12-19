import run from "aocrunner"

const bestTemplate = () => ({
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
  12: {},
  13: {},
  14: {},
  15: {},
  16: {},
  17: {},
  18: {},
  19: {},
  20: {},
  21: {},
  22: {},
  23: {},
  24: {},
  25: {},
  26: {},
  27: {},
  28: {},
  29: {},
  30: {},
})

class Valve {
  name: string
  flowRate: number
  tunnels: string[]

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
}

class State {
  map: ValveGraph
  valvesOpen: string[]
  pressureReleased: number
  currentNodeName: string
  minutesRemaining: number

  constructor(
    map: ValveGraph,
    currentNodeName: string,
    pressureReleased: number,
    valvesOpen: string[],
    minutesRemaining: number,
  ) {
    this.map = map
    this.valvesOpen = valvesOpen.slice()
    this.currentNodeName = currentNodeName
    this.pressureReleased = pressureReleased
    this.minutesRemaining = minutesRemaining
  }

  expectedPR(): number {
    return this.flowRate() * this.minutesRemaining + this.pressureReleased
  }

  nextStates(): State[] {
    const currentNode = this.map[this.currentNodeName]
    const nextValves = currentNode.tunnels.slice()
    if (
      currentNode.flowRate > 0 &&
      !this.valvesOpen.includes(this.currentNodeName)
    ) {
      nextValves.push(currentNode.name)
    }

    const nextStates: State[] = []

    for (const nextValve of nextValves) {
      const nextValvesOpen = this.valvesOpen.slice()
      if (nextValve === this.currentNodeName) {
        nextValvesOpen.push(this.currentNodeName)
      }
      nextStates.push(
        new State(
          this.map,
          nextValve,
          this.pressureReleased + this.flowRate(),
          this.valvesOpen.concat(
            nextValve === this.currentNodeName ? [nextValve] : [],
          ),
          this.minutesRemaining - 1,
        ),
      )
    }

    return nextStates
  }

  flowRate(): number {
    return this.valvesOpen.reduce(
      (flowRate, valveName) => flowRate + this.map[valveName].flowRate,
      0,
    )
  }
}

// class Path {
//   visited: string[]
//   minutesRemaining: number
//   pressureReleased: number
//
//   constructor(visited: string[], minutesRemaining = 30, pressureReleased = 0) {
//     this.visited = visited.slice()
//     this.minutesRemaining = minutesRemaining
//     this.pressureReleased = pressureReleased
//   }
//
//   next(nextValve: Valve): Path {
//     let pressureReleased = this.pressureReleased
//     if (nextValve.name === this.visited[this.visited.length - 1]) {
//       pressureReleased += nextValve.flowRate
//     }
//
//     return new Path(
//       this.visited.concat(nextValve.name),
//       this.minutesRemaining - 1,
//       pressureReleased,
//     )
//   }
// }

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

const part1 = (rawInput: string) => {
  const valveGraph = Object.freeze(parseInput(rawInput))
  const bestAchieved: { [minsLeft: number]: { [node: string]: State } } = bestTemplate()

  const MAXMINS = 30
  // Best state we can achieve for 30 mins is nothing - starting point, 0 PR, and 30 mins left
  bestAchieved[MAXMINS]["AA"] = new State(valveGraph, "AA", 0, [], MAXMINS)

  // Go through each minute
  for (let mins = MAXMINS; mins > 0; mins--) {
    // For each node, get the best expected state for this minute
    for (const nodeName in bestAchieved[mins]) {
      // For that best expected state for this minute, get the next states
      const currNode = bestAchieved[mins][nodeName]
      const nextStates = currNode.nextStates()

      // For each of those next states, add them to the best expected states for the next minute
      for (const nextState of nextStates) {
        const nextNodeName = nextState.currentNodeName
        bestAchieved[mins - 1][nextNodeName] = bestState(
          nextState,
          bestAchieved[mins - 1][nextNodeName],
        )
      }
    }
  }

  return Math.max(
    ...Object.values(bestAchieved[0]).map((state) => state.pressureReleased),
  )
}

function bestState(s1: State, s2: State | undefined): State {
  if (!s2) {
    return s1
  }

  return s1.expectedPR() > s2.expectedPR() ? s1 : s2
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
        expected: 1651,
      },
      {
        input: `
Valve AA has flow rate=0; tunnels lead to valves BA
Valve BA has flow rate=2; tunnels lead to valves AA, CA
Valve CA has flow rate=4; tunnels lead to valves BA, DA
Valve DA has flow rate=6; tunnels lead to valves CA, EA
Valve EA has flow rate=8; tunnels lead to valves DA, FA
Valve FA has flow rate=10; tunnels lead to valves EA, GA
Valve GA has flow rate=12; tunnels lead to valves FA, HA
Valve HA has flow rate=14; tunnels lead to valves GA, IA
Valve IA has flow rate=16; tunnels lead to valves HA, JA
Valve JA has flow rate=18; tunnels lead to valves IA, KA
Valve KA has flow rate=20; tunnels lead to valves JA, LA
Valve LA has flow rate=22; tunnels lead to valves KA, MA
Valve MA has flow rate=24; tunnels lead to valves LA, NA
Valve NA has flow rate=26; tunnels lead to valves MA, OA
Valve OA has flow rate=28; tunnels lead to valves NA, PA
Valve PA has flow rate=30; tunnels lead to valves OA
`,
        expected: 2640,
      },
      {
        input: `
Valve AA has flow rate=0; tunnels lead to valves BA
Valve BA has flow rate=1; tunnels lead to valves AA, CA
Valve CA has flow rate=4; tunnels lead to valves BA, DA
Valve DA has flow rate=9; tunnels lead to valves CA, EA
Valve EA has flow rate=16; tunnels lead to valves DA, FA
Valve FA has flow rate=25; tunnels lead to valves EA, GA
Valve GA has flow rate=36; tunnels lead to valves FA, HA
Valve HA has flow rate=49; tunnels lead to valves GA, IA
Valve IA has flow rate=64; tunnels lead to valves HA, JA
Valve JA has flow rate=81; tunnels lead to valves IA, KA
Valve KA has flow rate=100; tunnels lead to valves JA, LA
Valve LA has flow rate=121; tunnels lead to valves KA, MA
Valve MA has flow rate=144; tunnels lead to valves LA, NA
Valve NA has flow rate=169; tunnels lead to valves MA, OA
Valve OA has flow rate=196; tunnels lead to valves NA, PA
Valve PA has flow rate=225; tunnels lead to valves OA
`,
        expected: 13468,
      },
      {
        input: `
Valve BA has flow rate=2; tunnels lead to valves AA, CA
Valve CA has flow rate=10; tunnels lead to valves BA, DA
Valve DA has flow rate=2; tunnels lead to valves CA, EA
Valve EA has flow rate=10; tunnels lead to valves DA, FA
Valve FA has flow rate=2; tunnels lead to valves EA, GA
Valve GA has flow rate=10; tunnels lead to valves FA, HA
Valve HA has flow rate=2; tunnels lead to valves GA, IA
Valve IA has flow rate=10; tunnels lead to valves HA, JA
Valve JA has flow rate=2; tunnels lead to valves IA, KA
Valve KA has flow rate=10; tunnels lead to valves JA, LA
Valve LA has flow rate=2; tunnels lead to valves KA, MA
Valve MA has flow rate=10; tunnels lead to valves LA, NA
Valve NA has flow rate=2; tunnels lead to valves MA, OA
Valve OA has flow rate=10; tunnels lead to valves NA, PA
Valve PA has flow rate=2; tunnels lead to valves OA, AA
Valve AA has flow rate=0; tunnels lead to valves BA, PA
`,
        expected: 1288,
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
  onlyTests: false,
})
