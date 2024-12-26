import sys

small_final = '''
########
#....OO#
##.....#
#.....O#
#.#O@..#
#...O..#
#...O..#
########

<^^>>>vv<v>>v<<
'''.strip()

small = '''
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
'''.strip()

large = '''
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
'''.strip()

large_doubled = '''
####################
##....[]....[]..[]##
##............[]..##
##..[][]....[]..[]##
##....[]@.....[]..##
##[]##....[]......##
##[]....[]....[]..##
##..[][]..[]..[][]##
##........[]......##
####################
'''.strip()

double_ex = '''
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
'''.strip()

test_1 = '''
#######
#...#.#
#..OO.#
#..OO@#
#..O..#
#.....#
#######

<>vv<<<<^^
'''.strip()

def parse(input):
    raw_grid, dirs = input.split('\n\n')
    return parse_grid(raw_grid), parse_dirs(dirs.replace('\n', ''))

def parse_dirs(dirs):
    moves = {
        '^': (0,-1),
        'v': (0, 1),
        '<': (-1, 0),
        '>': (1, 0),
    }
    return [moves[d] for d in list(dirs)]

def parse_grid(input):
    grid = {}
    lines = input.split('\n')
    for r, line in enumerate(lines):
        for c, char in enumerate(list(line)):
            grid[(c,r)] = char
            if char == '@':
                robot = (c,r)
    return grid, robot, (len(lines[0]), len(lines))

def grid_to_str(grid, size):
    s = []
    for r in range(size[1]):
        for c in range(size[0]):
            s.append(grid[(c,r)])
        s.append('\n')
    return ''.join(s)

def make_move(grid, current, move, indent=''):
    next_loc = (current[0] + move[0], current[1] + move[1])
    if grid[next_loc] == '#':
        return None
    if grid[next_loc] == '.':
        grid[next_loc] = grid[current]
        grid[current] = '.'
        return next_loc
    if grid[next_loc] == 'O':
        result = make_move(grid, next_loc, move, indent + "  ")
        if result:
            grid[next_loc] = grid[current]
            grid[current] = '.'
            return next_loc
        return None
    raise Exception('Reached end of make_move')

def make_move_2(grid, current, move, indent=''):
    # Do robot only first
    next_loc = (current[0] + move[0], current[1] + move[1])
    if grid[next_loc] == '#':
        return None
    if grid[next_loc] == '.':
        grid[next_loc] = grid[current]
        grid[current] = '.'
        return next_loc
    if grid[next_loc] in ['[', ']']:
        if move in [(-1,0), (1,0)]:
            result = make_move_2(grid, next_loc, move, indent + "  ")
            if result:
                grid[next_loc] = grid[current]
                grid[current] = '.'
                return next_loc
            return None
        if move in [(0,-1),(0,1)]:
            return make_vertical_move(grid, current, move)
    raise Exception('Reached end of make_move_2')

def make_vertical_move(grid, current, move):
    assert(move in [(0,-1),(0,1)])
    if grid[current] == '@':
        next_loc = (current[0] + move[0], current[1] + move[1])
        result = make_vertical_move(grid, next_loc, move)
        if result:
            boxes, vacated = result
            grid.update(vacated)
            grid.update(boxes)
            grid[next_loc] = '@'
            grid[current] = '.'
            return next_loc
        return None

    if grid[current] == '[':
        other = (current[0] + 1, current[1])
    elif grid[current] == ']':
        other = (current[0] - 1, current[1])
    else:
        raise Exception

    next_c = (current[0] + move[0], current[1] + move[1])
    next_o = (other[0] + move[0], other[1] + move[1])
    if grid[next_c] == '#' or grid[next_o] == '#':
        # print(current, next_c, next_o, "wall")
        return None
    if grid[next_c] in ['[', ']']:
        # print(current, next_c, "next c box")
        next_c_result = make_vertical_move(grid, next_c, move)
    elif grid[next_c] == '.':
        # print(current, next_c, "next c space")
        next_c_result = ({ next_c: grid[current] }, {})

    if not next_c_result:
        return None

    if grid[next_o] in ['[', ']']:
        # print(current, next_o, "next o box")
        next_o_result = make_vertical_move(grid, next_o, move)
    elif grid[next_o] == '.':
        # print(current, next_o, "next o space")
        next_o_result = ({ next_o: grid[other] }, {})

    if not next_o_result:
        return None

    vacated = next_c_result[1] | next_o_result[1] | {current: '.', other: '.'}
    boxes = next_c_result[0] | next_o_result[0] | {next_c: grid[current], next_o: grid[other]}
    # print(f'current: {current} -> {next_c}, other: {other} -> {next_o},')
    # print(boxes)
    # print(vacated)
    # print('--------------')

    return boxes, vacated

def gps(grid, size):
    total = 0
    for r in range(size[1]):
        for c in range(size[0]):
            if grid[(c, r)] in ['O', '[']:
                total += 100 * r + c
    return total


def part1(input):
    (grid, robot, size), moves = parse(input)
    for move in moves:
        nm = make_move(grid, robot, move)
        if nm:
            robot = nm
    return gps(grid, size)

def part2(input_str):
    v_to_c = {
        (0,-1):'^' ,
        (0, 1):'v' ,
        (-1, 0):'<' ,
        (1, 0):'>' ,
    }
    (grid, robot, size), moves = parse(input_str)
    grid, robot, size = double(grid, size)
    # print(grid_to_str(grid, size))
    for move in moves:
        nm = make_move_2(grid, robot, move)
        if nm:
            robot = nm
        # print(f'\nMove {v_to_c[move]}:')
        # input()


        # print(grid_to_str(grid, size))
    return gps(grid, size)

def double(grid, size):
    new_grid = {}
    new_size = (size[0] * 2, size[1])
    for r in range(size[1]):
        for c in range(size[0]):
            char = grid[(c, r)] 
            if char == 'O':
                new_grid[(c * 2, r)] = '['
                new_grid[(c * 2 + 1, r)] = ']'
            elif char == '@':
                robot = (c * 2, r)
                new_grid[robot] = '@'
                new_grid[(c * 2 + 1, r)] = '.'
            else:
                new_grid[(c * 2, r)] = char
                new_grid[(c * 2 + 1, r)] = char
    return (new_grid, robot, new_size)
            


def test():
    assert(part1(small) == 2028)
    assert(part1(large) == 10092)
    (g, r, s), m = parse(large)
    d, r, s = double(g,s)
    assert(grid_to_str(d, s) == large_doubled + '\n')
    result = part2(double_ex) 
    assert(result == 105 + 207 + 306)
    assert(part2(large) == 9021)
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
            answer2 = part2(input)
            if answer2 in [1566878]:
                print('Answer previously submitted and incorrect:', answer2)
                assert(False)
            print('Part 2:', part2(input))


