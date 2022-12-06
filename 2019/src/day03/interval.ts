import { isNull } from "util"

export class Interval {
  start: number
  end: number

  constructor(p1: number, p2: number) {
    this.start = p1
    this.end = p2
  }

  contains(num: number) {
    const lower = Math.min(this.start, this.end)
    const upper = Math.max(this.start, this.end)
    return num >= lower && num <= upper
  }
}

export function assertInterval(
  maybeInterval: unknown,
): asserts maybeInterval is Interval {
  if (
    typeof maybeInterval !== "object" ||
    isNull(maybeInterval) ||
    !("start" in maybeInterval && "end" in maybeInterval)
  ) {
    throw new Error("does not have the properties to be an interval")
  }

  if (
    typeof maybeInterval.start !== "number" ||
    typeof maybeInterval.end !== "number"
  ) {
    throw new Error("start or end have wrong type to be interval")
  }
}
