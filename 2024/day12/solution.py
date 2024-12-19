import sys

ex1 = '''
AAAA
BBCD
BBCC
EEEC
'''.strip()

ex2 = '''
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
'''.strip()

ex3 = '''
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
'''.strip()

ex4 = '''
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
'''.strip()

ex5 = '''
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
'''.strip()

def parse(input):
    grid = {}
    for r, line in enumerate(input.split('\n')):
        for c, pt in enumerate(list(line)):
            grid[(r,c)] = pt

    return grid

def neighbors(grid, pt):
    ns = []
    offsets = [(-1, 0), (1, 0), (0, 1), (0, -1)]
    for o in offsets:
        new_pt = (pt[0] + o[0], pt[1] + o[1])
        n = grid.get(new_pt)
        if n:
            ns.append(new_pt)
    return ns

'''
Need:
    - grid
    - to_visit
    - visited
    - regions [(area, perime, pts)]

Algo:
    - start with grid keys in to_visit
    - while there are points in to_visit
        - pop a point from to_visit into region_to_visit
        - create region
        - while there are points in region_to_visit:
            - pop to current_point
            - if the current_point is not in region pts:
                - region area += 1
                - add current_point to region points
            - get the neighbors and filter for the same letter
            - region perim += 4 - len(neighbors)
            - add neighbors to region_to_visit



'''

def add_sides(region):
    pts = region['pts']
    region['sides'] = 0

    for p in pts:
        up = (p[0] - 1, p[1]) in pts
        down =  (p[0] + 1, p[1]) in pts
        left =  (p[0], p[1] - 1) in pts
        right = (p[0], p[1] + 1) in pts
        upright = (p[0] - 1, p[1] + 1) in pts
        upleft = (p[0] - 1, p[1] - 1) in pts
        downright = (p[0] + 1, p[1] + 1) in pts
        downleft = (p[0] + 1, p[1] - 1) in pts

        # Outside corners
        if not up and not right:
            region['sides'] += 1
        if not up and not left:
            region['sides'] += 1
        if not down and not right:
            region['sides'] += 1
        if not down and not left:
            region['sides'] += 1
        # Inside corners
        if up and right and not upright:
            region['sides'] += 1
        if up and left and not upleft:
            region['sides'] += 1
        if down and right and not downright:
            region['sides'] += 1
        if down and left and not downleft:
            region['sides'] += 1


def make_regions(grid):
    to_visit = set(grid.keys())
    regions = []

    while to_visit:
        starting_point = to_visit.pop()
        region = { 'crop': grid[starting_point], 'area': 0, 'perim': 0, 'pts': set() }
        region_to_visit = set([starting_point])

        while region_to_visit:
            current_point = region_to_visit.pop()
            to_visit.discard(current_point)
            
            if current_point in region['pts']:
                continue

            region['area'] += 1
            region['pts'].add(current_point)
            nbs = [n for n in neighbors(grid, current_point) if grid[current_point] == grid[n]]
            region['perim'] += 4 - len(nbs)
            region_to_visit.update(nbs)

        add_sides(region)

        regions.append(region)

    return regions


def part1(input):
    grid = parse(input)
    regions = make_regions(grid)
    return sum([r['area'] * r['perim'] for r in regions])


def part2(input):
    grid = parse(input)
    regions = make_regions(grid)
    return sum(r['area'] * r['sides'] for r in regions)
    pass

def test():
    assert(part2(ex1) == 80)
    assert(part1(ex1) == 140)
    assert(part1(ex2) == 772)
    assert(part1(ex3) == 1930)
    assert(part2(ex1) == 80)
    assert(part2(ex4) == 236)
    assert(part2(ex3) == 1206)
    assert(part2(ex5) == 368)
    assert(part2(ex2) == 436)
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


