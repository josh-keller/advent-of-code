import { orderPackets } from '../src/utils/day13.util'

describe('examples from aoc', () => {
  test('one', () => {
    expect(orderPackets([1,1,3,1,1], [1,1,5,1,1])).toBeLessThan(0)
  })

  test('two', () => {
    expect(orderPackets([[1],[2,3,4]], [[1],4])).toBeLessThan(0)
  })

  test('three', () => {
    expect(orderPackets([9], [[8,7,6]])).toBeGreaterThan(0)
  })
  
  test('four', () => {
    expect(orderPackets([[4,4],4,4], [[4,4],4,4,4])).toBeLessThan(0)
  })
  
  test('five', () => {
    expect(orderPackets([7,7,7,7], [7,7,7])).toBeGreaterThan(0)
  })
  
  test('six', () => {
    expect(orderPackets([], [3])).toBeLessThan(0)
  })
  
  test('seven', () => {
    expect(orderPackets([[[]]], [[]])).toBeGreaterThan(0)
  })
  
  test('eight', () => {
    expect(orderPackets([1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9])).toBeGreaterThan(0)
  })
})
