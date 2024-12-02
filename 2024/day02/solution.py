import sys

test_data = '''
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
'''.strip()

def parse(input):
    return [[int(n) for n in line.split(' ')] for line in input.split('\n')]

def safe(inst):
    if not all([abs(x) in [1, 2, 3] for x in inst]):
        return False

    return all(x > 0 for x in inst) or all(x < 0 for x in inst)

def get_diffs(line):
    diff = []
    for i in range(len(line) - 1):
        diff.append(line[i+1] - line[i])
    return diff

def part1(input):
    nums = parse(input)
    diffs = [get_diffs(l) for l in nums]
    return len([d for d in diffs if safe(d)])

def part2(input):
    levels = parse(input)
    count = 0
    for level in levels:
        if safe(get_diffs(level)):
            count += 1
        else:
            for i in range(len(level)):
                if safe(get_diffs([l for j, l in enumerate(level) if j != i])):
                    count += 1
                    break

    return count

        

def test():
    assert(part1(test_data) == 2)
    assert(part2(test_data) == 4)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            print('Part 1:', part1(input))
            print('Part 2:', part2(input))


