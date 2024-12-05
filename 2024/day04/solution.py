import re
import sys

test_input = '''
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
'''.strip()

# Create a 2d array of characters
# Find all X's
# For each direction:
#  - Keep moving while the next letter is expected
#  - Stop if out of range
#  - If you get to S, increment

def make_grid(input):
    grid = [[' '] + [c for c in list(line)] + [' '] for line in input.split('\n')]
    length = len(grid[0])
    return [[' '] * length] + grid + [[' '] * length]

def xmas_search(grid, l, c):
    count = 0
    dirs = [(1, 0), (0, 1), (1, 1), (-1, 0), (0, -1), (1, -1), (-1, 1), (-1, -1)]
    for dir in dirs:
        new_l = l
        new_c = c
        for letter in ['M', 'A', 'S']:
            new_l += dir[0]
            new_c += dir[1]
            if grid[new_l][new_c] != letter:
                break
        else:
            count += 1

    return count

def part1_comprehension(input):
    grid = make_grid(input)
    return sum([sum([xmas_search(grid, l, c) for c, char in enumerate(line) if char == 'X']) for l, line in enumerate(grid)])

def part1(input):
    grid = make_grid(input)
    count = 0
    for l, line in enumerate(grid):
        for c, char in enumerate(line):
            if char == 'X':
                count += xmas_search(grid, l, c)

    return count

def check_diag(grid, l, c, slope):
    return (
        (grid[l-1][c-slope] == 'M' and grid[l+1][c+slope] == 'S') or
        (grid[l-1][c-slope] == 'S' and grid[l+1][c+slope] == 'M')
    )

def is_xmas(grid, l, c):
    return check_diag(grid, l, c, 1) and check_diag(grid, l, c, -1)
        

def part2(input):
    grid = make_grid(input)
    count = 0
    for l, line in enumerate(grid):
        for c, char in enumerate(line):
            if char == 'A' and is_xmas(grid, l, c):
                count += 1

    return count
                

def test():
    assert(part1(test_input) == 18)
    assert(part2(test_input) == 9)
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


