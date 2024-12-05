import functools
import sys
import math

@functools.cache
def factors(n):
    f = set()
    f.add(n)
    f.add(1)

    for i in range(n // 2, math.ceil(math.sqrt(n) - 1), -1):
        if n % i == 0:
            ff = factors(i)
            f.update(ff)
            f.update(map(lambda x: n // x, ff))
            break
    return sorted(tuple(f))


def presents(i):
    return sum([f * 10 for f in factors(i)])


def part1(input):
    i = input // 44
    max = 0
    while True:
        p = sum([f * 10 for f in factors(i)])
        if p > max:
            max = p
            print(i, p, p / i)
            print("  ", factors(i), "\n")
        if p >= input:
            return i
        i += 1

def part2(input):
    i = input // 42
    max = 0
    while True:
        filtered_factors = [f * 11 for f in factors(i) if i <= f * 50]
        p = sum(filtered_factors)
        if p > max:
            max = p
            print(i, p, p / i)
            print("  ", filtered_factors, "\n")
        if p >= input:
            return i
        i += 1

def test():
    assert(presents(1) == 10)
    assert(presents(2) == 30)
    assert(presents(3) == 40)
    assert(presents(4) == 70)
    assert(presents(5) == 60)
    assert(presents(6) == 120)
    assert(presents(7) == 80)
    assert(presents(10) == 180)
    assert(presents(12) == 280)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = int(f.read().strip())
            # print('Part 1:', part1(input))
            print('Part 2:', part2(input))


