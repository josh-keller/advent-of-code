import sys

test_input = '''
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
'''.strip()

next_dir = {
    (-1,0): (0,1),
    (0,1): (1,0),
    (1,0): (0,-1),
    (0,-1): (-1,0),
}

def parse(input):
    grid = {}
    for r, line in enumerate(input.split('\n')):
        for c, char in enumerate(list(line)):
            if char == '^':
                grid[(r,c)] = '.'
                guard = (r,c)
                dir = (-1,0)
                continue

            grid[(r, c)] = char
            
    grid['height'] = r + 1
    grid['width'] = c + 1
    return grid, guard, dir

def move(grid, guard, dir):
    # Check the next square of the guard
    next_loc = (guard[0] + dir[0], guard[1] + dir[1])
    if not 0 <= next_loc[0] < grid['height']:
        return None, None
    if not 0 <= next_loc[1] < grid['width']:
        return None, None

    if grid[next_loc] == '#':
        return move(grid, guard, next_dir[dir])

    return next_loc, dir

def map_route(grid, guard, dir):
    visited = set()

    while True:
        visited.add((guard, dir))
        guard, dir = move(grid, guard, dir)
        if guard == None:
            return visited, False
        if (guard, dir) in visited:
            return visited, True


def part1(input):
    grid, guard, dir = parse(input)
    visited, is_loop = map_route(grid, guard, dir)
    return len(set([v[0] for v in visited]))

def part2(input):
    grid, guard, dir = parse(input)
    place_blocks = [l for l in grid if l not in ['width', 'height', guard] and grid[l] != '#']

    loop_count = 0

    for loc in place_blocks:
        grid[loc] = '#'
        visited, is_loop = map_route(grid, guard, dir)
        if is_loop:
            loop_count += 1
        grid[loc] = '.'

    return loop_count


def test():
    assert(part1(test_input) == 41)
    assert(part2(test_input) == 6)

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


