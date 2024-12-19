import sys

'''
--- Day 1: No Time for a Taxicab ---
You're airdropped near Easter Bunny Headquarters in a city somewhere. "Near", unfortunately, is as close as you can get -
the instructions on the Easter Bunny Recruiting Document the Elves intercepted start here, and nobody had time to work them out further.

The Document indicates that you should start at the given coordinates (where you just landed) and face North.
Then, follow the provided sequence: either turn left (L) or right (R) 90 degrees, then walk forward the given number of blocks, ending at a new intersection.

There's no time to follow such ridiculous instructions on foot, though, so you take a moment and work out the destination.
Given that you can only walk on the street grid of the city, how far is the shortest path to the destination?

For example:

Following R2, L3 leaves you 2 blocks East and 3 blocks North, or 5 blocks away.
R2, R2, R2 leaves you 2 blocks due South of your starting position, which is 2 blocks away.
R5, L5, R5, R3 leaves you 12 blocks away.
How many blocks away is Easter Bunny HQ?
'''

test_input = [
    ('R2, L3', 5),
    ('R2, R2, R2', 2),
    ('R5, L5, R5, R3', 12),
]

next_dir = {
    (0,1): {
        'R': (1,0),
        'L': (-1,0),
    },
    (1,0): {
        'R': (0,-1),
        'L': (0,1),
    },
    (0,-1): {
        'R': (-1,0),
        'L': (1,0),
    },
    (-1,0): {
        'R': (0,1),
        'L': (0,-1),
    },
}

def parse(input):
    return [(d[0], int(d[1:])) for d in input.split(', ')]

def part1(input):
    dirs = parse(input)
    loc = (0,0)
    dir = (0,1)

    for d in dirs:
        dir = next_dir[dir][d[0]]
        vect = (d[1] * dir[0], d[1] * dir[1])
        loc = (loc[0] + vect[0], loc[1] + vect[1])

    return abs(loc[0]) + abs(loc[1])


def part2(input):
    dirs = parse(input)
    loc = (0,0)
    dir = (0,1)
    locs = set([loc])

    for d in dirs:
        dir = next_dir[dir][d[0]]
        for i in range(d[1]):
            loc = (loc[0] + dir[0], loc[1] + dir[1])
            if loc in locs:
                break
            locs.add(loc)
        else:
            continue
        break

    return abs(loc[0]) + abs(loc[1])
    pass

def test():
    for tc in test_input:
        assert(part1(tc[0]) == tc[1])
    assert(part2('R8, R4, R4, R8') == 4)
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


