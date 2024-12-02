import sys
import re

def parse_line(line):
    match = re.match(r'(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)', line)
    if not match:
        raise "Couldn't parse"
    x1 = int(match[2])
    x2 = int(match[4])
    y1 = int(match[3])
    y2 = int(match[5])
    return {
        'action': match[1],
        'left': min(x1, x2),
        'right': max(x1, x2),
        'top': min(y1, y2),
        'bottom': max(y1, y2),
    }

def parse(input):
    return [parse_line(line) for line in input.split('\n')]

def part1(input):
    instructions = parse(input)
    lights = {}
    for inst in instructions:
        for x in range(inst['left'], inst['right'] + 1):
            for y in range(inst['top'], inst['bottom'] + 1):
                current = lights.get((x,y), False)
                if inst['action'] == 'toggle':
                    lights[(x,y)] = not current
                elif inst['action'] == 'turn on':
                    lights[(x,y)] = True
                elif inst['action'] == 'turn off':
                    lights[(x,y)] = False
                else:
                    raise ValueError

    return len([l for l in lights.values() if l])



def part2(input):
    instructions = parse(input)
    lights = {}
    for inst in instructions:
        for x in range(inst['left'], inst['right'] + 1):
            for y in range(inst['top'], inst['bottom'] + 1):
                current = lights.get((x,y), 0)
                if inst['action'] == 'toggle':
                    lights[(x,y)] = current + 2
                elif inst['action'] == 'turn on':
                    lights[(x,y)] = current + 1
                elif inst['action'] == 'turn off':
                    if current != 0:
                        lights[(x,y)] = current - 1
                else:
                    raise ValueError

    return sum([b for b in lights.values()])

    pass

def test():
    assert(part1('turn on 0,0 through 999,999\ntoggle 0,0 through 999,0\nturn off 499,499 through 500,500') == 1_000_000 - 1000 - 4)
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
