import { Interval } from './interval' 

test('constructor should create interval with start and end', () => {
  const interval = new Interval(1, 2)
  const interval2 = new Interval(2, 1)
  expect(interval.start).toEqual(1)
  expect(interval2.start).toEqual(2)
})

describe('Contains', () => {
  const interval = new Interval(1, 5)

  it('should contain a number that is between start and end', () => {
    expect(interval.contains(3)).toEqual(true)
  })

  it('should contain a number that is equal to start', () => {
    expect(interval.contains(1)).toEqual(true)
  })

  it('should contain a number that is equal to end', () => {
    expect(interval.contains(5)).toEqual(true)
  })

  it('should not contain a number that is less than start', () => {
    expect(interval.contains(-2)).toEqual(false)
  })

  it('should not contain a number that is greater than end', () => {
    expect(interval.contains(7)).toEqual(false)
  })
})
