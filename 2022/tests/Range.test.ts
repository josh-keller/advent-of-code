import { Range } from '../src/utils/Range.js'

describe('Create range from string', () => {
  it('should create a range from a string with form "dd-dd"', () => {
    const range = new Range("12-14")
    expect(range.start).toBe(12)
    expect(range.end).toBe(14)
  })

  it('should throw exception when the wrong string format is passed', () => {
    expect(() => new Range("12--14")).toThrow()
    expect(() => new Range("12,14")).toThrow()
    expect(() => new Range("1..5")).toThrow()
  })
}) 

describe('Create range from two numbers', () => {
  it('should create a range with the input of two numbers', () => {
    const range = new Range(2, 4)
    expect(range.start).toBe(2)
    expect(range.end).toBe(4)
  })
})
