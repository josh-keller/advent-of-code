import functools
import sys

test_input = '''
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
'''.strip()

def parse_line(line):
    parts = line.split(' ')
    return ( parts[0], parts[2], int(parts[4]) )

def parse(input):
    edges = []
    for edge in [parse_line(line) for line in input.split('\n')]:
        edges.append(edge)
        # edges.append({'source': edge['target'], 'target': edge['source'], 'distance': edge['distance']})

    edges.sort(key=lambda e: e[2])
    return edges

def make_map(edges):
    map = {}
    for e in edges:
        if e[0] not in map.keys():
            map[e[0]] = {}
        map[e[0]][e[1]] = e[2]

        if e[1] not in map.keys():
            map[e[1]] = {}
        map[e[1]][e[0]] = e[2]

    return map

def shortest_helper(map, start, visited, func):
    neighbors = [n for n in map[start].keys() if n not in visited]
    if not neighbors:
        return 0

    distances = []
    for n in neighbors:
        next_visited = list(visited)
        next_visited.append(start)
        distances.append(map[start][n] + shortest_helper(map, n, next_visited, func))

    return func(distances)
        
def shortest_rec(map, func=min):
    return func([shortest_helper(map, city, [], func) for city in map.keys()])

def part1(input):
    edges = parse(input)
    map = make_map(edges)
    return shortest_rec(map)

def part2(input):
    edges = parse(input)
    map = make_map(edges)
    return shortest_rec(map, max)

def test():
    assert(part1(test_input) == 605)
    assert(part2(test_input) == 982)
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


