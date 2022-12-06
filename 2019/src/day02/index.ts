import run from "aocrunner"
import { parseIntCode as parseInput } from "../utils/intcode"

type Instruction = 1 | 2 | 99

const ADD: Instruction = 1
const MUL: Instruction = 2
const END: Instruction = 99

const isInstruction = (n: number): n is Instruction => {
  return n === 1 || n === 2 || n === 99
}

class IntCodeMachine {
  code: number[]

  constructor(code: number[], noun: number, verb: number) {
    this.code = code.slice()
    this.code[1] = noun
    this.code[2] = verb
  }

  print() {
    for (let i = 0; i < this.code.length; i += 4) {
      if (this.code[i] === 99) {
        console.log(i, ": ", this.code[i], ",")
        i++
      }

      console.log(i, ": ", this.code.slice(i, i + 4).join(","))
    }
  }
  
  add(idx: number): void {
    const addr1 = this.code[idx + 1]
    const addr2 = this.code[idx + 2]
    const addrResult = this.code[idx + 3]
    // console.log("Add: ", addr1, addr2, addrResult)
    const result = this.code[addr1] + this.code[addr2]
    // console.log(`Writing ${result} to address: ${addrResult}`)

    this.code[addrResult] = result
  }

  multiply(idx: number): void {
    const addr1 = this.code[idx + 1]
    const addr2 = this.code[idx + 2]
    const addrResult = this.code[idx + 3]
    const result = this.code[addr1] * this.code[addr2]
    // console.log(`Writing ${result} to address: ${addrResult}`)

    this.code[addrResult] = result
  }

  run(): number {
    for (let idx = 0; isInstruction(this.code[idx]); idx += 4) {
      const instruction = this.code[idx]
      switch (instruction) {
        case END:
          return this.code[0]
        case ADD:
          this.add(idx)
          break
        case MUL:
          this.multiply(idx)
          break
        default:
          throw new Error("Unknown code")
          break
      }
    }

    return this.code[0]
  }
}

const part1 = (rawInput: string) => {
  const code = parseInput(rawInput)
  const machine = new IntCodeMachine(code, 12, 2)
  const result = machine.run()
  return `${result}`
}

const part2 = (rawInput: string) => {
  const code = parseInput(rawInput)
  let noun
  let verb

  for (noun = 0; noun < 100; noun++) {
    for (verb = 0; verb < 100; verb++) {
      const machine = new IntCodeMachine(code, noun, verb)
      const result = machine.run()
      if (19690720 == result) {
        return 100 * noun + verb
      }
    }
  }

  throw new Error("No solution found")
}

run({
  part1: {
    tests: [
      // {
      //   input: `1,9,10,3,2,3,11,0,99,30,40,50`,
      //   expected: "3500",
      // },
      // {
      //   input: `1,0,0,0,99`, 
      //   expected: "2",
      // },
      // {
      //   input: `2,3,0,3,99`, 
      //   expected: "2",
      // },
      // {
      //   input: `2,4,4,5,99,0`, 
      //   expected: "2",
      // },
      // {
      //   input: `1,1,1,4,99,5,6,0,99`, 
      //   expected: "30",
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
