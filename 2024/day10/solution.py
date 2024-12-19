import sys

test_input = '''
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
'''.strip()

def parse(input):
    grid = {}
    trailheads = set()
    for r, line in enumerate(input.split('\n')):
        for c, pt in enumerate(list(line)):
            grid[(r,c)] = int(pt)
            if pt == '0':
                trailheads.add((r,c))

    return grid, trailheads

def neighbors(grid, pt):
    ns = []
    offsets = [(-1, 0), (1, 0), (0, 1), (0, -1)]
    for o in offsets:
        new_pt = (pt[0] + o[0], pt[1] + o[1])
        n = grid.get(new_pt)
        if n:
            ns.append(new_pt)
    return ns


def find_trail(grid, pt):
    if grid[pt] == 9:
        return [pt]

    next_steps = [n for n in neighbors(grid, pt) if grid[pt] + 1 == grid[n]]
    trail_ends = []
    for ns in next_steps:
        trail_ends += find_trail(grid, ns)

    return trail_ends


def part1(input):
    grid, trailheads = parse(input)
    ends = []

    for t in trailheads:
        ends += set(find_trail(grid, t))
    return len(ends)
    

def part2(input):
    grid, trailheads = parse(input)
    ends = []

    for t in trailheads:
        ends += find_trail(grid, t)
    return len(ends)

def test():
    assert(part1(test_input) == 36)
    assert(part2(test_input) == 81)
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


