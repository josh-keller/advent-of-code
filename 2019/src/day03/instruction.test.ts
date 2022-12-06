import { followInstruction, parseInstruction } from "./instruction"
import { Interval, assertInterval } from "./interval.js"

describe("parse instructions from strings", () => {
  it("should create a down instruction from D", () => {
    const inst = parseInstruction("D12")
    expect(inst).toEqual({ dir: "D", dist: 12 })
  })

  it("should create an up instruction from U", () => {
    const inst = parseInstruction("U5")
    expect(inst).toEqual({ dir: "U", dist: 5 })
  })

  it("should create an left instruction from L", () => {
    const inst = parseInstruction("L3")
    expect(inst).toEqual({ dir: "L", dist: 3 })
  })

  it("should create an right instruction from R", () => {
    const inst = parseInstruction("R20")
    expect(inst).toEqual({ dir: "R", dist: 20 })
  })
})

describe("Follow Instrucion", () => {
  it("should return a vertical line for up", () => {
    const inst = parseInstruction("U5")
    const line = followInstruction([0, 0], inst)

    expect(line.type).toBe("vert")
    expect(line.x).toBe(0)
    assertInterval(line.y)
    expect(line.y.start).toBe(0)
    expect(line.y.end).toBe(5)
  })

  it("should return a vertical line for down", () => {
    const inst = parseInstruction("D5")
    const line = followInstruction([0, 0], inst)

    expect(line.type).toBe("vert")
    expect(line.x).toBe(0)
    assertInterval(line.y)
    expect(line.y.start).toBe(0)
    expect(line.y.end).toBe(-5)
  })

  it("should return a horizontal line for Left", () => {
    const inst = parseInstruction("L5")
    const line = followInstruction([0, 0], inst)

    expect(line.type).toBe("horiz")
    expect(line.y).toBe(0)
    expect(line.x).toHaveProperty("start")
    assertInterval(line.x)
    expect(line.x.start).toBe(0)
    expect(line.x.end).toBe(-5)
  })

  it("should return a horizontal line for Right", () => {
    const inst = parseInstruction("R5")
    const line = followInstruction([0, 0], inst)

    expect(line.type).toBe("horiz")
    expect(line.y).toBe(0)
    expect(line.x).toHaveProperty("start")
    assertInterval(line.x)
    expect(line.x.start).toBe(0)
    expect(line.x.end).toBe(5)
  })
})
