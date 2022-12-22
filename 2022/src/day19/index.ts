import run from "aocrunner"

const lineRegex =
  /Blueprint \d+: Each ore robot costs (?<oreOreCost>\d+) ore\. Each clay robot costs (?<clayOreCost>\d+) ore\. Each obsidian robot costs (?<obsOreCost>\d+) ore and (?<obsClayCost>\d+) clay\. Each geode robot costs (?<geoOreCost>\d+) ore and (?<geoObsCost>\d+) obsidian\./

type Names = "ore" | "clay" | "obsidian" | "geode"
type Count = Record<Names, number>
type Cost = Count & { geode: 0 }
type Blueprint = Record<Names, Cost>

interface StatsInit {
  oreOreCost: string
  clayOreCost: string
  obsOreCost: string
  obsClayCost: string
  geoOreCost: string
  geoObsCost: string
}

const names: readonly Names[] = Object.freeze([
  "ore",
  "clay",
  "obsidian",
  "geode",
])

const startingRobots: Count = Object.freeze({
  ore: 1,
  clay: 0,
  obsidian: 0,
  geode: 0,
})

const startingResources: Count = Object.freeze({
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
})

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const blueprints: Blueprint[] = []

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
      ore: Object.freeze({
        ore: parseInt(matchedLine.groups.oreOreCost),
        clay: 0,
        obsidian: 0,
        geode: 0,
      }),
      clay: Object.freeze({
        ore: parseInt(matchedLine.groups.clayOreCost),
        clay: 0,
        obsidian: 0,
        geode: 0,
      }),
      obsidian: Object.freeze({
        ore: parseInt(matchedLine.groups.obsOreCost),
        clay: parseInt(matchedLine.groups.obsClayCost),
        obsidian: 0,
        geode: 0,
      }),
      geode: Object.freeze({
        ore: parseInt(matchedLine.groups.geoOreCost),
        clay: 0,
        obsidian: parseInt(matchedLine.groups.geoObsCost),
        geode: 0,
      }),
    }
    blueprints.push(Object.freeze(cost))
  })

  return Object.freeze(blueprints)
}

function addCount(c1: Count, c2: Count): Count {
  return {
    ore: c1.ore + c2.ore,
    clay: c1.clay + c2.clay,
    obsidian: c1.obsidian + c2.obsidian,
    geode: c1.geode + c2.geode,
  }
}

function subCount(c1: Count, c2: Count): Count {
  return {
    ore: c1.ore - c2.ore,
    clay: c1.clay - c2.clay,
    obsidian: c1.obsidian - c2.obsidian,
    geode: c1.geode - c2.geode,
  }
}

function multCount(c: Count, n: number): Count {
  return {
    ore: c.ore * n,
    clay: c.clay * n,
    obsidian: c.obsidian * n,
    geode: c.geode * n,
  }
}

class State {
  resources: Count
  robots: Count

  constructor(robots: Count, resources: Count) {
    this.robots = robots
    this.resources = resources
  }

  nextResources(): Count {
    return addCount(this.resources, this.robots)
  }

  tick(): State {
    return new State({ ...this.robots }, addCount(this.robots, this.resources))
  }

  toString(): string {
    return `${this.robots.ore},${this.robots.clay},${this.robots.obsidian},${this.robots.geode}|${this.resources.ore},${this.resources.clay},${this.resources.obsidian},${this.resources.geode}`
  }

  addRobots(robotsToAdd: Count, blueprint: Blueprint): State {
    for (const robotName of names) {
      const count = robotsToAdd[robotName]
      this.robots[robotName] += count
      this.resources = subCount(this.resources, multCount(blueprint[robotName], count))
    }

    return this
  }
}

const dfs = (
  state: State,
  blueprint: Blueprint,
  memo: Map<string, number>,
  minsLeft: number,
): number => {
  if (minsLeft === 0) {
    return state.resources.geode
  }

  const stateStr = state.toString()

  if (memo.has(stateStr)) {
    return memo.get(stateStr) as number
  }

  // Which robots can we afford?
  const nextStates = getNextStates(state, blueprint)

  const geodeCounts = nextStates.map((nextState) =>
    dfs(nextState, blueprint, memo, minsLeft - 1),
  )
  const maxCount = geodeCounts.reduce(
    (max, count) => (count > max ? count : max),
    -1,
  )
  if (maxCount === -1) {
    throw new Error("Whacky geode count!")
  }

  memo.set(stateStr, maxCount)

  return maxCount
}

const zeroCount: Count = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
}

const getNextStates = (state: State, blueprint: Blueprint): State[] => {
  const nextStates: State[] = []
  console.log("State:", state)
  for (
    let oreCount = 0;
    oreCount <= 2;
    // canAfford({...zeroCount, ore: oreCount}, state.resources, blueprint);
    oreCount++
  ) {
    for (
      let clayCount = 0;
      clayCount <= 2;
      // canAfford({...zeroCount, clay: clayCount, ore: oreCount}, state.resources, blueprint);
      clayCount++
    ) {
      for (
        let obsCount = 0;
        obsCount <= 2;
        // canAfford({geode: 0, obsidian: obsCount, clay: clayCount, ore: oreCount}, state.resources, blueprint);
        obsCount++
      ) {
        for (
          let geoCount = 0;
          geoCount <= 2;
          // canAfford({geode: geoCount, obsidian: obsCount, clay: clayCount, ore: oreCount}, state.resources, blueprint);
          geoCount++
        ) {
            const robotsToAdd = { ore: oreCount, clay: clayCount, obsidian: obsCount, geode: geoCount }
            // console.log("Try to add:", robotsToAdd)
            if (canAfford(robotsToAdd, state.resources, blueprint)) {
              const stateToAdd = new State({...state.robots}, state.nextResources()).addRobots(robotsToAdd, blueprint)
              // console.log("Adding", stateToAdd)
              nextStates.push(stateToAdd)
            }
          }
      }
    }
  }

  return nextStates
}

const canAfford = (
  robotCounts: Count,
  resources: Count,
  blueprint: Blueprint,
): boolean => {
  const totalCost = names.map(name => multCount(blueprint[name], robotCounts[name])).reduce((sums, curr) => addCount(sums, curr))
  const resourcesLeft = subCount(resources, totalCost)
  return Object.values(resourcesLeft).every((n) => n >= 0)
}

const part1 = (rawInput: string) => {
  const costs = parseInput(rawInput)

  const bests = costs.map((cost) => {
    console.log("Calling dfs:", cost)
    const result = dfs(
      new State(startingRobots, startingResources),
      cost,
      new Map<string, number>(),
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
        input: `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
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
