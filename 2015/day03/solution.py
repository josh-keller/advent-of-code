import sys
from typing import Set

def parse(input):
    return input


def part1(input):
    current = (0,0)
    houses = set([current])

    for dir in input:
        if dir == '^':
            current = (current[0], current[1] + 1)
        elif dir == 'v':
            current = (current[0], current[1] - 1)
        elif dir == '<':
            current = (current[0] - 1, current[1])
        elif dir == '>':
            current = (current[0] + 1, current[1])
        else:
            raise ValueError
        houses.add(current)

    return len(houses)

def part2(input):
    pos = [(0,0), (0,0)]
    houses = set([(0,0)])

    for i, dir in enumerate(input):
        current = pos[i % 2]
        
        if dir == '^':
            current = (current[0], current[1] + 1)
        elif dir == 'v':
            current = (current[0], current[1] - 1)
        elif dir == '<':
            current = (current[0] - 1, current[1])
        elif dir == '>':
            current = (current[0] + 1, current[1])
        else:
            raise ValueError
        houses.add(current)
        pos[i % 2] = current

    return len(houses)

def test():
    assert(part1('>') == 2)
    assert(part1('^>v<') == 4)
    assert(part1('v^v^v^v^v') == 2)
    assert(part2('^v') == 3)
    assert(part2('^>v<') == 3)
    assert(part2('^v^v^v^v^v') == 11)
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
