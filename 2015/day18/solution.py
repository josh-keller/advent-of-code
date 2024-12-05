import sys

test_input = '''
.#.#.#
...##.
#....#
..#...
#.#..#
####..
'''.strip()

class Grid(object):
    def __init__(self, grid, size):
        self.grid = grid
        self.size = size

    @staticmethod
    def from_string(input, on="#", off="."):
        grid = {}
        lines = input.split('\n')
        for r, line in enumerate(lines):
            for c, col in enumerate(list(line)):
                if col == on:
                    grid[(r,c)] = True
                elif col == off:
                    grid[(r,c)] = False
                else:
                    raise Exception

        return Grid(grid, len(lines))

    def neighbors(self, point):
        ns = []
        for x in range(-1, 2):
            for y in range(-1, 2):
                if x == 0 and y == 0:
                    continue
                new_x = point[0] + x
                if new_x < 0 or new_x >= self.size:
                    continue

                new_y = point[1] + y
                if new_y < 0 or new_y >= self.size:
                    continue
                ns.append((new_x, new_y))
        return ns

    def print(self):
        for x in range(self.size):
            print(''.join(["#" if self.grid[(x,y)] else "." for y in range(self.size)]))

    def next_grid(self):
        new_grid = {}
        for point, on in self.grid.items():
            neighbors_on = len([True for p in self.neighbors(point) if self.grid[p]])
            if on:
                new_grid[point] = True if neighbors_on in [2, 3] else False
            else:
                new_grid[point] = True if neighbors_on == 3 else False

        return Grid(new_grid, self.size)

    def count_on(self):
        return len([p for p in self.grid.values() if p])

    def corners_on(self):
        self.grid[(0,0)] = True
        self.grid[(0,self.size-1)] = True
        self.grid[(self.size-1,0)] = True
        self.grid[(self.size-1,self.size-1)] = True


def part1(input, count=100):
    grid = Grid.from_string(input)
    for i in range(count):
        grid = grid.next_grid()
    return grid.count_on()
        

def part2(input, count=100):
    grid = Grid.from_string(input)

    grid.corners_on()
    grid.print()

    for i in range(count):
        grid = grid.next_grid()
        grid.corners_on()
        print("---------")
        grid.print()

    return grid.count_on()

def test():
    assert(part1(test_input, 4) == 4)
    assert(part2(test_input, 5) == 17)
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


