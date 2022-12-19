import run from "aocrunner"

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

class SingleState {
  map: ValveGraph
  minsLeft: number
  currentNode: string
  valvesOpen: Set<string>

  constructor(
    map: ValveGraph,
    minsLeft: number,
    currentNode: string,
    valvesOpen: string[],
  ) {
    this.map = map
    this.minsLeft = minsLeft
    this.valvesOpen = new Set(valvesOpen)
    this.currentNode = currentNode
  }

  releaseRate(): number {
    return [...this.valvesOpen].reduce(
      (total, openV) => total + this.map[openV].flowRate,
      0,
    )
  }

  nextStates(): SingleState[] {
    const currentNode = this.map[this.currentNode]
    const nextValves = currentNode.tunnels.slice()
    if (currentNode.flowRate > 0 && !this.valvesOpen.has(this.currentNode)) {
      nextValves.push(currentNode.name)
    }

    const nextStates: SingleState[] = []

    for (const nextValve of nextValves) {
      const nextValvesOpen = new Set(this.valvesOpen)
      if (nextValve === this.currentNode) {
        nextValvesOpen.add(this.currentNode)
      }
      nextStates.push(
        new SingleState(this.map, this.minsLeft - 1, nextValve, [
          ...nextValvesOpen,
        ]),
      )
    }

    return nextStates
  }

  toString(): string {
    return `${this.minsLeft}|${this.currentNode}|${[...this.valvesOpen]
      .sort()
      .join(",")}`
  }
}

class DoubleState {
  map: ValveGraph
  minsLeft: number
  currentNode1: string
  currentNode2: string
  valvesOpen: string[]

  constructor(
    map: ValveGraph,
    minsLeft: number,
    currentNode1: string,
    currentNode2: string,
    valvesOpen: string[],
  ) {
    this.map = map
    this.minsLeft = minsLeft
    this.valvesOpen = valvesOpen.slice()
    this.currentNode1 = currentNode1
    this.currentNode2 = currentNode2
  }

  releaseRate(): number {
    return this.valvesOpen.reduce(
      (total, openV) => total + this.map[openV].flowRate,
      0,
    )
  }

  nextStates(): DoubleState[] {
    const currentNode1 = this.map[this.currentNode1]
    const currentNode2 = this.map[this.currentNode2]

    let nextValves1 = currentNode1.tunnels.slice()
    let nextValves2 = currentNode2.tunnels.slice()
    // Always turn on *****
    if (
      currentNode1.flowRate > 0 &&
      !this.valvesOpen.includes(this.currentNode1)
    ) {
      if (currentNode1.flowRate > 6) {
        nextValves1 = [currentNode1.name]
      } else {
        nextValves1.push(currentNode1.name)
      }
    }
    if (
      currentNode2.flowRate > 0 &&
      !this.valvesOpen.includes(this.currentNode2) &&
      this.currentNode1 !== this.currentNode2
    ) {
      if (currentNode2.flowRate > 6) {
        nextValves2 = [currentNode2.name]
      } else {
        nextValves2.push(currentNode2.name)
      }
    }

    const nextStates: DoubleState[] = []
    const nextStateSet = new Set<string>()

    for (const nextValve1 of nextValves1) {
      for (const nextValve2 of nextValves2) {
        // Don't go to the same valve at the same time? ***
        // if (nextValve2 === nextValve1) {
        //   continue
        // }

        const nextNewState = new DoubleState(
          this.map,
          this.minsLeft - 1,
          nextValve1,
          nextValve2,
          this.valvesOpen
            .concat(nextValve1 === this.currentNode1 ? [nextValve1] : [])
            .concat(nextValve2 === this.currentNode2 ? [nextValve2] : []),
        )

        const stateString = nextNewState.toString()
        if (!nextStateSet.has(stateString)) {
          nextStateSet.add(stateString)
          nextStates.push(nextNewState)
        }
      }
    }

    return nextStates
  }

  toString(): string {
    return `${this.minsLeft}|${[
      this.currentNode1,
      this.currentNode2,
    ].sort()}|${this.valvesOpen.sort().join(",")}`
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

interface State {
  minsLeft: number
  releaseRate(): number
  nextStates(): State[]
}

const dfs = (state: State, memo: { [stateString: string]: number }): number => {
  if (state.minsLeft === 0) {
    return 0
  }

  const stateString = state.toString()

  if (memo[stateString]) {
    return memo[stateString]
  }

  const bestRelease =
    state.releaseRate() +
    Math.max(...state.nextStates().map((ns) => dfs(ns, memo)))

  memo[stateString] = bestRelease

  // if (state.minsLeft % 10 === 0) {
  //   // console.log(stateString)
  // }

  return bestRelease
}

const part1 = (rawInput: string) => {
  const valveGraph = Object.freeze(parseInput(rawInput))

  return dfs(new SingleState(valveGraph, 30, "AA", []), {})
}

const part2 = (rawInput: string) => {
  const valveGraph = Object.freeze(parseInput(rawInput))
  
  // const me = dfs(new SingleState(valveGraph, 26, "AA", []), {})
  return dfs(new DoubleState(valveGraph, 26, "AA", "AA", []), {})
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
      //       {
      //         input: `
      // Valve AA has flow rate=0; tunnels lead to valves BA
      // Valve BA has flow rate=2; tunnels lead to valves AA, CA
      // Valve CA has flow rate=4; tunnels lead to valves BA, DA
      // Valve DA has flow rate=6; tunnels lead to valves CA, EA
      // Valve EA has flow rate=8; tunnels lead to valves DA, FA
      // Valve FA has flow rate=10; tunnels lead to valves EA, GA
      // Valve GA has flow rate=12; tunnels lead to valves FA, HA
      // Valve HA has flow rate=14; tunnels lead to valves GA, IA
      // Valve IA has flow rate=16; tunnels lead to valves HA, JA
      // Valve JA has flow rate=18; tunnels lead to valves IA, KA
      // Valve KA has flow rate=20; tunnels lead to valves JA, LA
      // Valve LA has flow rate=22; tunnels lead to valves KA, MA
      // Valve MA has flow rate=24; tunnels lead to valves LA, NA
      // Valve NA has flow rate=26; tunnels lead to valves MA, OA
      // Valve OA has flow rate=28; tunnels lead to valves NA, PA
      // Valve PA has flow rate=30; tunnels lead to valves OA
      // `,
      //         expected: 2640,
      //       },
      //       {
      //         input: `
      // Valve AA has flow rate=0; tunnels lead to valves BA
      // Valve BA has flow rate=1; tunnels lead to valves AA, CA
      // Valve CA has flow rate=4; tunnels lead to valves BA, DA
      // Valve DA has flow rate=9; tunnels lead to valves CA, EA
      // Valve EA has flow rate=16; tunnels lead to valves DA, FA
      // Valve FA has flow rate=25; tunnels lead to valves EA, GA
      // Valve GA has flow rate=36; tunnels lead to valves FA, HA
      // Valve HA has flow rate=49; tunnels lead to valves GA, IA
      // Valve IA has flow rate=64; tunnels lead to valves HA, JA
      // Valve JA has flow rate=81; tunnels lead to valves IA, KA
      // Valve KA has flow rate=100; tunnels lead to valves JA, LA
      // Valve LA has flow rate=121; tunnels lead to valves KA, MA
      // Valve MA has flow rate=144; tunnels lead to valves LA, NA
      // Valve NA has flow rate=169; tunnels lead to valves MA, OA
      // Valve OA has flow rate=196; tunnels lead to valves NA, PA
      // Valve PA has flow rate=225; tunnels lead to valves OA
      // `,
      //         expected: 13468,
      //       },
      //       {
      //         input: `
      // Valve BA has flow rate=2; tunnels lead to valves AA, CA
      // Valve CA has flow rate=10; tunnels lead to valves BA, DA
      // Valve DA has flow rate=2; tunnels lead to valves CA, EA
      // Valve EA has flow rate=10; tunnels lead to valves DA, FA
      // Valve FA has flow rate=2; tunnels lead to valves EA, GA
      // Valve GA has flow rate=10; tunnels lead to valves FA, HA
      // Valve HA has flow rate=2; tunnels lead to valves GA, IA
      // Valve IA has flow rate=10; tunnels lead to valves HA, JA
      // Valve JA has flow rate=2; tunnels lead to valves IA, KA
      // Valve KA has flow rate=10; tunnels lead to valves JA, LA
      // Valve LA has flow rate=2; tunnels lead to valves KA, MA
      // Valve MA has flow rate=10; tunnels lead to valves LA, NA
      // Valve NA has flow rate=2; tunnels lead to valves MA, OA
      // Valve OA has flow rate=10; tunnels lead to valves NA, PA
      // Valve PA has flow rate=2; tunnels lead to valves OA, AA
      // Valve AA has flow rate=0; tunnels lead to valves BA, PA
      // `,
      //         expected: 1288,
      //       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
//         input: `
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II
// `,
        // expected: 1707,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
