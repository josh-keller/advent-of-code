import sys

def parse(input):
    a = []
    b = []
    for line in input.split('\n'):
        nums = line.split('  ')
        a.append(int(nums[0]))
        b.append(int(nums[1]))
    
    assert(all(a) and all(b))
    assert(len(a) == len(b))

    return a, b


def part1(input):
    a, b = parse(input)
    a.sort()
    b.sort()

    diff = 0
    for i in range(len(a)):
        diff += abs(a[i] - b[i])

    return diff

def part2(input):
    left, right = parse(input)
    counts = {}
    for r in right:
        if not counts.get(r):
            counts[r] = 0
        counts[r] += 1

    similarity = 0
    for l in left:
        similarity += l * counts.get(l, 0)

    return similarity

def test(input=None):
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            test(input)
            print('Part 1:', part1(input))
            print('Part 2:', part2(input))


