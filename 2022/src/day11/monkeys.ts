export type Monkey = {
  items: bigint[]
  operation(item: bigint): bigint
  test(item: bigint): number
  inspections: number
}

export const testMonkeys = [
  // 0
  {
    items: [79n, 98n],
    operation(item: bigint): bigint {
      return item * 19n
    },
    test(item: bigint): number {
      return item % 23n === 0n ? 2 : 3
    },
    inspections: 0,
  },
  // 1
  {
    items: [54n, 65n, 75n, 74n],
    operation(item: bigint): bigint {
      return item + 6n
    },
    test(item: bigint): number {
      return item % 19n === 0n ? 2 : 0
    },
    inspections: 0,
  },
  {
    items: [79n, 60n, 97n],
    operation(item: bigint): bigint {
      return item * item
    },
    test(item: bigint): number {
      return item % 13n === 0n ? 1 : 3
    },
    inspections: 0,
  },
  // 3
  {
    items: [74n],
    operation(item: bigint): bigint {
      return item + 3n
    },
    test(item: bigint): number {
      return item % 17n === 0n ? 0 : 1
    },
    inspections: 0,
  },
]

export const testMod = 23n * 19n * 13n * 17n

export const monkeys = [
  //0
  {
    items: [66n, 71n, 94n],
    operation(item: bigint): bigint {
      return item * 5n
    },
    test(item: bigint): number {
      return item % 3n === 0n ? 7 : 4
    },
    inspections: 0,
  },
  //1
  {
    items: [70n],
    operation(item: bigint): bigint {
      return item + 6n
    },
    test(item: bigint): number {
      return item % 17n === 0n ? 3 : 0
    },
        inspections: 0,
  },
  //2
  {
    items: [62n, 68n, 56n, 65n, 94n, 78n],
    operation(item: bigint): bigint {
      return item + 5n
    },
    test(item: bigint): number {
      return item % 2n === 0n ? 3 : 1
    },
    inspections: 0,
  },
  //3
  {
    items: [89n, 94n, 94n, 67n],
    operation(item: bigint): bigint {
      return item + 2n
    },
    test(item: bigint): number {
      return item % 19n === 0n ? 7 : 0
    },
    inspections: 0,
  },
  //4
  {
    items: [71n, 61n, 73n, 65n, 98n, 98n, 63n],
    operation(item: bigint): bigint {
      return item * 7n
    },
    test(item: bigint): number {
      return item % 11n === 0n ? 5 : 6
    },
    inspections: 0,
  },
  //5
  {
    items: [55n, 62n, 68n, 61n, 60n],
    operation(item: bigint): bigint {
      return item + 7n
    },
    test(item: bigint): number {
      return item % 5n === 0n ? 2 : 1
    },
    inspections: 0,
  },
  //6
  {
    items: [93n, 91n, 69n, 64n, 72n, 89n, 50n, 71n],
    operation(item: bigint): bigint {
      return item + 1n
    },
    test(item: bigint): number {
      return item % 13n === 0n ? 5: 2
    },
    inspections: 0,
  },
  //7
  {
    items: [76n, 50n],
    operation(item: bigint): bigint {
      return item * item
    },
    test(item: bigint): number {
      return item % 7n === 0n ? 4 : 6
    },
    inspections: 0,
  },
]

export const mod = 3n * 17n * 2n * 19n * 11n * 5n * 13n * 7n
