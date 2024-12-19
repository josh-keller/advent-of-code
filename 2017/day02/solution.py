import re
import sys
import itertools

test_input = '''
5 1 9 5
7 5 3
2 4 6 8
'''.strip()

test_input_2 = '''
5 9 2 8
9 4 7 3
3 8 6 5
'''.strip()

def parse(input):
    lines = input.split('\n')
    return [[int(d) for d in re.split(r'\s+', line)] for line in lines]

def part1(input):
    return sum([max(l) - min(l) for l in parse(input)])

def part2(input):
    nums = parse(input)
    sum = 0
    for num_line in nums:
        for i, n in enumerate(num_line):
            for j in range(i + 1, len(num_line)):
                if n % num_line[j] == 0:
                    sum += n // num_line[j]
                    break
                if num_line[j] % n == 0:
                    sum += num_line[j] // n
                    break
    return sum


def test():
    assert(part1(test_input) == 18)
    assert(part2(test_input_2) == 9)
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


