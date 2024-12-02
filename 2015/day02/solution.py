import sys

def parse(input):
    dims = [[int(d) for d in line.split('x')] for line in input.strip().split('\n')]
    for d in dims:
        d.sort()
    return dims

def part1(input):
    total = 0
    parsed = parse(input)
    for p in parsed:
        total += 3 * p[0] * p[1]
        total += 2 * p[0] * p[2]
        total += 2 * p[1] * p[2]

    return total

# Perimeter of smallest face + volume
def part2(input):
    parsed = parse(input)
    total = 0
    for p in parsed:
        total += 2 * p[0] + 2 * p[1]
        total += p[0] * p[1] * p[2]

    return total


def test():
    assert(part1('2x3x4') == 58)
    assert(part1('1x1x10') == 43)
    assert(part2('2x3x4') == 34)
    assert(part2('1x1x10') == 14)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read()
            print('Part 1:', part1(input))
            print('Part 2:', part2(input))


