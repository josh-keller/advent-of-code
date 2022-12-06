import { Interval } from "./interval.js"

export type Direction = "R" | "D" | "U" | "L"

export type Instruction = {
  dir: Direction
  dist: number
}

export function assertDirection(dir: string): asserts dir is Direction {
  if (!["R", "L", "U", "D"].includes(dir)) {
    throw new Error("Not a direction!")
  }
}

export const parseInstruction = (rawInstruction: string): Instruction => {
  const dir: string = rawInstruction[0]
  assertDirection(dir)

  const dist = Number.parseInt(rawInstruction.slice(1))

  return {
    dir,
    dist,
  }
}

export type HorizontalLine = {
  type: "horiz"
  x: Interval
  y: number
}

export type VerticalLine = {
  type: "vert"
  x: number
  y: Interval
}

export type Line = HorizontalLine | VerticalLine

export const followInstruction = (
  start: [number, number],
  instruction: Instruction,
): Line => {
  switch (instruction.dir) {
    case "U":
      return {
        type: "vert",
        x: start[0],
        y: new Interval(start[1], start[1] + instruction.dist),
      }
    case "D":
      return {
        type: "vert",
        x: start[0],
        y: new Interval(start[1], start[1] - instruction.dist),
      }
    case "R":
      return {
        type: "horiz",
        x: new Interval(start[0], start[0] + instruction.dist),
        y: start[1],
      }
    case "L":
      return {
        type: "horiz",
        x: new Interval(start[0], start[0] - instruction.dist),
        y: start[1],
      }
  }
}
