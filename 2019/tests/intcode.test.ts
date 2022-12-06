import { OpCode, ParamMode, Instruction } from '../src/utils/intcode.js'

describe('Create instruction', () => {
  it('should parse 1002 correctly', () => {
    const instruction = new Instruction('1002')
    expect(instruction.opcode).toBe(OpCode.Mult)
    expect(instruction.paramModes[0]).toBe(ParamMode.Position)
    expect(instruction.paramModes[1]).toBe(ParamMode.Immediate)
    expect(instruction.paramModes[2]).toBe(ParamMode.Position)
  })

  it('should parse 10001 correctly', () => {
    const instruction = new Instruction('10001')
    expect(instruction.opcode).toBe(OpCode.Add)
    expect(instruction.paramModes[0]).toBe(ParamMode.Position)
    expect(instruction.paramModes[1]).toBe(ParamMode.Position)
    expect(instruction.paramModes[2]).toBe(ParamMode.Immediate)
  })
})

describe('Stop instruction', () => {
  it('should parse 99 correctly and return true for isHalt', () => {
    const instruction = new Instruction('99')
    expect(instruction.opcode).toBe(99)
    expect(instruction.continue()).toBe(false)
  })
})
