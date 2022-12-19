export type Packet = Array<number | Packet>

export const orderPackets = (left: Packet, right: Packet): number => {
  const defaultResult =
    left.length === right.length ? 0 : left.length - right.length
  const length = Math.min(left.length, right.length)

  for (let i = 0; i < length; i++) {
    let leftElement: number | Packet = left[i]
    let rightElement: number | Packet = right[i]

    if (typeof leftElement === "number" && typeof rightElement === "number") {
      if (leftElement === rightElement) continue
      return leftElement - rightElement
    }

    if (typeof leftElement === "number") {
      leftElement = [leftElement]
    }

    if (typeof rightElement === "number") {
      rightElement = [rightElement]
    }

    const result = orderPackets(leftElement, rightElement)
    if (result === 0) continue
    return result
  }

  return defaultResult
}
