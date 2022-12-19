export class Range {
  start: number
  end: number

  constructor(s: number, e: number)
  constructor(s: string)
  constructor(s: number | string, e?: number) {
    if (typeof s === "number") {
      if (e === undefined) {
        throw new Error("Argument error")
      }
      this.start = Math.min(s, e)
      this.end = Math.max(s, e)
    } else {
      const match = s.match(/(\d+)-(\d+)/)
      if (!match) {
        throw new Error("Invalid range syntax")
      }
      const n1 = parseInt(match[1])
      const n2 = parseInt(match[2])
      this.start = Math.min(n1, n2)
      this.end = Math.max(n1, n2)
    }
  }

  contains(input: number | Range): boolean {
    if (typeof input === "number") {
      return input >= this.start && input <= this.end
    }

    return this.start <= input.start && input.end <= this.end
  }

  overlaps(other: Range): boolean {
    return !(this.start > other.end || this.end < other.start)
  }

  touches(other: Range): boolean {
    return this.start - 1 === other.end || other.start - 1 === this.end
  }

  add(other: Range): Range | [Range, Range] {
    if (!(this.overlaps(other) || this.touches(other))) {
      return this.start < other.start ? [this, other] : [other, this]
    }

    return new Range(
      Math.min(this.start, other.start),
      Math.max(this.end, other.end),
    )
  }

  size(): number {
    return (this.end - this.start) + 1
  }
}
