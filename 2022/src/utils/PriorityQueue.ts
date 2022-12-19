type PriorityFunc<T> = (e1: T, e2: T) => number

export class PriorityQueue<T> {
  private elements: T[] = []
  private priorityFunc: PriorityFunc<T>

  constructor(priorityFunc: PriorityFunc<T>) {
    this.priorityFunc = priorityFunc
  }

  add(...newElements: T[]): void {
    for (const element of newElements) {
      this.elements.add(element)
    }
    this.elements.push(...newElements)
  }

  size(): number {
    return this.elements.length
  }

  isEmpty(): boolean {
    return this.elements.length === 0
  }

  public pop(): T {
    if (this.elements.length === 0) {
      throw new Error("Cannot pop from empty queue")
    }
    
    return this.elements.pop() as T // safe since we know it will have at least one element to pop
  }

}
