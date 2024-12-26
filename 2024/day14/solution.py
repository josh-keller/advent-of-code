import os
import sys
import time

test_input = '''
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
'''.strip()

test2 = '''
p=2,4 v=2,-3
'''.strip()

def parse(input):
    lines = [[s.split('=')[1] for s in l.split(' ')] for l in input.split('\n')]
    nums = [[eval('(' + t + ')') for t in l] for l in lines]
    return [{'p': n[0], 'v': n[1]} for n in nums]

def tick(robots, w, h):
    for r in robots:
        r['p'] = ((r['p'][0] + r['v'][0] + w) % w, (r['p'][1] + r['v'][1] + h) % h)

def print_grid(robots, w, h):
    lines = []
    poses = set([r['p'] for r in robots])
    for r in range(h):
        line = ''
        for c in range(w):
            if (c,r) in poses:
                line += '#'
            else:
                line += '.'
        lines.append(line)

    print('\n'.join(lines))


def part1(input, height=103, width=101, seconds=100):
    robots = parse(input)
    # print_grid(robots, width, height)
    # print('----')
    for i in range(seconds):
        tick(robots, width, height)
        # print_grid(robots, width, height)
        # print('----')

    mid_w = width // 2
    mid_h = height // 2

    top_left = sum([1 for r in robots if r['p'][0] < mid_w and r['p'][1] < mid_h])
    top_right = sum([1 for r in robots if r['p'][0] > mid_w and r['p'][1] < mid_h])
    bot_left = sum([1 for r in robots if r['p'][0] < mid_w and r['p'][1] > mid_h])
    bot_right = sum([1 for r in robots if r['p'][0] > mid_w and r['p'][1] > mid_h])
    result = top_left * top_right * bot_left * bot_right
    # print(top_left, top_right, bot_left, bot_right)
    return result


def part2(input, height=103, width=101, seconds=7050):
    robots = parse(input)
    for i in range(seconds):
        tick(robots, width, height)
        print('------', i + 1, '---------')
        if 7030 <= i <= 7050:
            print_grid(robots, width, height)

    pass

def test():
    # part1(test2, 7, 11, 5)
    assert(part1(test_input, 7, 11) == 12)
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


