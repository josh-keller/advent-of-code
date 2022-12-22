import run from "aocrunner"

const lineRegex =
  /Blueprint \d+: Each ore robot costs (?<oreOreCost>\d+) ore\. Each clay robot costs (?<clayOreCost>\d+) ore\. Each obsidian robot costs (?<obsOreCost>\d+) ore and (?<obsClayCost>\d+) clay\. Each geode robot costs (?<geoOreCost>\d+) ore and (?<geoObsCost>\d+) obsidian\./

type Names = "ore" | "clay" | "obsidian" | "geode"

class RobotCost {
  ore: number
  clay: number
  obsidian: number

  constructor(ore: number, clay = 0, obsidian = 0) {
    this.ore = ore
    this.clay = clay
    this.obsidian = obsidian
  }
}

interface Costs {
  ore: RobotCost
  clay: RobotCost
  obsidian: RobotCost
  geode: RobotCost
}

interface StatsInit {
  oreOreCost: string
  clayOreCost: string
  obsOreCost: string
  obsClayCost: string
  geoOreCost: string
  geoObsCost: string
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const costs: Costs[] = []

  lines.forEach((line) => {
    const matchedLine = line.match(lineRegex)
    if (
      !matchedLine?.groups ||
      !matchedLine.groups.oreOreCost ||
      !matchedLine.groups.clayOreCost ||
      !matchedLine.groups.obsOreCost ||
      !matchedLine.groups.obsClayCost ||
      !matchedLine.groups.geoOreCost ||
      !matchedLine.groups.geoObsCost
    ) {
      throw new Error("Line does not match regex")
    }
    const cost = {
      ore: Object.freeze(
        new RobotCost(parseInt(matchedLine.groups.oreOreCost)),
      ),
      clay: Object.freeze(
        new RobotCost(parseInt(matchedLine.groups.clayOreCost)),
      ),
      obsidian: Object.freeze(
        new RobotCost(
          parseInt(matchedLine.groups.obsOreCost),
          parseInt(matchedLine.groups.obsClayCost),
        ),
      ),
      geode: Object.freeze(
        new RobotCost(
          parseInt(matchedLine.groups.geoOreCost),
          0,
          parseInt(matchedLine.groups.geoObsCost),
        ),
      ),
    }
    costs.push(Object.freeze(cost))
  })

  return Object.freeze(costs)
}

type Counts = {
  ore: number
  clay: number
  obsidian: number
  geode: number
}

const names: readonly Names[] = Object.freeze([
  "ore",
  "clay",
  "obsidian",
  "geode",
])

const startingRobots: Counts = Object.freeze({
  ore: 1,
  clay: 0,
  obsidian: 0,
  geode: 0,
})

const startingResources: Counts = Object.freeze({
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
})

class State {
  robots: Counts
  resources: Counts

  constructor(robots: Counts, resources: Counts) {
    this.robots = { ...robots }
    this.resources = { ...resources }
  }

  tick(): State {
    return new State(this.robots, {
      ore: this.resources.ore + this.robots.ore,
      clay: this.resources.clay + this.robots.clay,
      obsidian: this.resources.obsidian + this.robots.obsidian,
      geode: this.resources.geode + this.robots.geode,
    })
  }

  toString(): string {
    return `${this.resources.ore},${this.resources.clay},${this.resources.obsidian},${this.resources.geode}|${this.robots.ore},${this.robots.clay},${this.robots.obsidian},${this.robots.geode}`
  }

  addRobot(robotName: Names, costs: Costs): State {
    const withRobot = new State(this.robots, this.resources)

    ;(["ore", "clay", "obsidian"] as const).forEach(
      (resource) =>
        (withRobot.resources[resource] -= costs[robotName][resource]),
    )
    withRobot.robots[robotName] += 1

    return withRobot
  }
}

const dfs = (
  state: State,
  costs: Costs,
  memo: Map<string, number>,
  itersLeft: number,
): number => {
  if (itersLeft === 24) {
    console.log("Starting:", state, memo)
  }
  // console.log("mins left:", itersLeft)
  // console.log("state:", state.robots, state.resources)
  if (itersLeft === 0) {
    return state.resources.geode
  }

  const stateStr = state.toString()

  if (memo.has(stateStr)) {
    return memo.get(stateStr) as number
  }

  // Which robots can we afford?
  const nextStates = getNextStates(state, costs)

  const geodeCounts = nextStates.map((nextState) =>
    dfs(nextState, costs, memo, itersLeft - 1),
  )
  const maxCount = geodeCounts.reduce(
    (max, count) => (count > max ? count : max),
    -1,
  )
  if (maxCount === -1) {
    throw new Error("Whacky geode count!")
  }

  memo.set(stateStr, maxCount)

  // console.log("max:", maxCount)
  return maxCount
}

const getNextStates = (state: State, costs: Costs): State[] => {
  const nextState = state.tick()
  // if (canAfford("geode", state, costs)) {
  //   return names
  //     .filter((r) => canAfford(r, state, costs))
  //     .map((r) => nextState.addRobot(r, costs))
  // }

  return [
    nextState,
    ...names
      .filter((r) => canAfford(r, state, costs))
      .map((r) => nextState.addRobot(r, costs)),
  ]
}

const canAfford = (
  robotName: keyof Costs,
  state: State,
  costs: Costs,
): boolean => {
  return (
    Object.entries(costs[robotName]) as Array<[keyof Costs, number]>
  ).every(([key, cost]) => cost <= state.resources[key])
}

const part1 = (rawInput: string) => {
  const costs = parseInput(rawInput)
  console.log(new State(startingRobots, startingResources).toString())
  console.log(new State(startingRobots, startingResources).tick().toString())

  const bests = costs.map((cost) => {
    console.log("Calling dfs:", cost)
    const memo = new Map<string, number>()
    const result = dfs(
      new State(startingRobots, startingResources),
      cost,
      memo,
      24,
    )
    return result
  })
  console.log(bests)

  return bests
    .map((best, idx) => (idx + 1) * best)
    .reduce((sum, num) => sum + num)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        // Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
        input: `
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`,
        expected: 33,
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
  onlyTests: true,
})
