import sys
import re

def part1(input):
    return sum([int(m[0]) * int(m[1]) for m in re.findall(r'mul\((\d+),(\d+)\)', input)])

def part2(input):
    cleaned = [do.split("don't()")[0] for do in input.strip().split('do()')]
    return (part1(''.join(cleaned)))

def test():
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


