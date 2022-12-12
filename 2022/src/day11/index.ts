import run from "aocrunner"
import { Monkey, testMonkeys, monkeys, testMod, mod } from "./monkeys.js"

function monkeyTurn(monkeys: Monkey[], idx: number): void {
  // const monkey = monkeys[idx]
  //
  // while (monkey.items.length > 0) {
  //   let item = monkey.items.shift()
  //   if (item === undefined) { throw new Error("item undefined") }
  //   item = monkey.operation(item)
  //   monkey.inspections++
  //   item = BigInt(Math.floor(item / 3))
  //   const nextMonkey = monkey.test(item)
  //   monkeys[nextMonkey].items.push(item)
  // }
  return
}

function monkeyTurn2(monkeys: Monkey[], idx: number): void {
  const monkey = monkeys[idx]

  while (monkey.items.length > 0) {
    let item = monkey.items.shift()
    if (item === undefined) { throw new Error("item undefined") }

    item = monkey.operation(item)
    monkey.inspections++

    item = item % mod
    const nextMonkey = monkey.test(item)
    monkeys[nextMonkey].items.push(item)
  }
}

const parseInput = (rawInput: string) => rawInput

const part1 = (rawInput: string) => {
  const ms = monkeys
  for (let i = 1; i <= 20; i++) {
    ms.forEach((_, idx) => monkeyTurn(ms, idx))
  }

  const inspections = ms.map(m => m.inspections).sort((a, b) => a - b)
  return inspections[inspections.length - 1] * inspections[inspections.length - 2]
}

const part2 = (rawInput: string) => {
  const ms = monkeys
  for (let i = 1; i <= 10000; i++) {
    ms.forEach((_, idx) => monkeyTurn2(ms, idx))
  }

  let inspections = ms.map(m => m.inspections)
  inspections = inspections.sort((a, b) => a - b)
  console.log(inspections)
  return inspections[inspections.length - 1] * inspections[inspections.length - 2]
}

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
