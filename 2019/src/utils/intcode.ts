export function parseIntCode(rawInput: string) {
  return rawInput.split(",").map((s: string) => Number.parseInt(s))
}

type InstructionInfo = {
  numParams: 0 | 1 | 2 | 3
  storeParam: undefined | 1 | 2 | 3
  op(...args: unknown[]): number | void
}

export const instructions: Record<OpCode, InstructionInfo> = {
  1: {
    numParams: 3,
    storeParam: 3,
    op: (a: number, b: number) => a + b,
  },
  2: {
    numParams: 3,
    storeParam: 3,
    op: (a: number, b: number) => a * b,
  },
  3: {
    numParams: 1,
    storeParam: 1,
    op: (inputFunc: () => number) => inputFunc(),
  },
  4: {
    numParams: 1,
    storeParam: undefined,
    op: (n: number, outputFunc: (n: number) => void) => outputFunc(n)
  },
  99: {
    numParams: 0,
    storeParam: undefined,
    op: (): void => { return },
  },
}

export enum ParamMode {
  Position,
  Immediate,
}

export enum OpCode {
  Add = 1,
  Mult,
  Input,
  Output,
  Halt = 99,
}

export class Instruction {
  opcode: OpCode
  paramModes: [ParamMode, ParamMode, ParamMode] = [0, 0, 0]

  constructor(input: number | string) {
    if (typeof input === 'string') {
      input = parseInt(input)
    }

    this.opcode = input % 100 
    input = Math.floor(input / 100)

    for (let i = 0; i < 3; i++) {
      const paramMode = input % 10

      if (paramMode != 0 && paramMode != 1) {
        throw new Error("Incorrect paramater code")
      }

      this.paramModes[i] = paramMode
      input = Math.floor(input / 10)
    }
  }

  continue(): boolean {
    return this.opcode !== 99
  }
}

class Machine {
  memory: number[]
  inputFunc: () => number
  outputFunc: (n: number) => void = (n: number) => console.log("Output: ", n)

  constructor(memory: number[], inputFunc: () => number, outputFunc?: (n: number) => void) {
    this.memory = memory.slice()
    this.inputFunc = inputFunc
    if (outputFunc !== undefined) {
      this.outputFunc = outputFunc
    }
  }

  run() {
    let addrPtr = 0
    let instruction = new Instruction(this.memory[addrPtr])
    while(instruction.continue()) {
      const paramValues = this.getParamValues(instruction)
      

    }
    //   - get the info about the current opcode
  }

  getParamValues(instruction: Instruction): number[] {
    const info = instructions[instruction.opcode]
    if (info.storeParam && instruction.paramModes[info.storeParam - 1] !== ParamMode.Position) {
      throw new Error("Invalid output param mode")
    }

    for (let i = 0; i < info.storeParam - 1; i++) {

    }

    instruction
  }

}

/*

Memory - array of integers
Opcode - beginning of an instruction
  - Parameters - values following the opcode
  - Has a certain number of parameters
Instruction Pointer - address of the current instruction
  - Increases by the number in the current opcode


Intcode programs are given as a list of integers;
these values are used as the initial state for the computer's memory.
When you run an Intcode program, make sure to start by initializing
memory to the program's values. A position in memory is called an address
(for example, the first value in memory is at "address 0").

Opcodes (like 1, 2, or 99) mark the beginning of an instruction.
The values used immediately after an opcode, if any, are called the
instruction's parameters. For example, in the instruction 1,2,3,4,
1 is the opcode; 2, 3, and 4 are the parameters.
The instruction 99 contains only an opcode and has no parameters.

The address of the current instruction is called the instruction pointer;
it starts at 0.
After an instruction finishes, the instruction pointer increases by the
number of values in the instruction;
until you add more instructions to the computer, this is always 4
(1 opcode + 3 parameters) for the add and multiply instructions.
(The halt instruction would increase the instruction pointer by 1,
but it halts the program instead.)

*/
