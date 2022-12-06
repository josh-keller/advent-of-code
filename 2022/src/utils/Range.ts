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
      this.start = s
      this.end = e
    } else {
      const match = s.match(/(\d+)-(\d+)/)
      if (!match) {
        throw new Error("Invalid range syntax")
      }
      this.start = parseInt(match[1])
      this.end = parseInt(match[2])
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
}

