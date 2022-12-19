import { PriorityQueue } from '../src/utils/PriorityQueue'

describe('Create new and add', () => {
  it('should have size 0 when created with no elements', () => {
    const emptyQueue = new PriorityQueue<number>((e1, e2) => e1 - e2)
    expect(emptyQueue.isEmpty()).toBe(true)
  })

  it('should have size corresponding to how many elements are added', () => {
    const q = new PriorityQueue<number>((e1, e2) => e1 - e2)
    q.add(1, 2)
    expect(q.size()).toBe(2)
  })
})

describe('Popping elements', () => {
  it('should return numbers in ascending order no matter what order they were added', () => {
    const arr = [5, 3, 4, 1, 7]
    const q = new PriorityQueue<number>((e1, e2) => e1 - e2)
    q.add(...arr)
    arr.sort()

    for (const e of arr) {
      expect(q.pop()).toBe(e)
    }
  })
})

