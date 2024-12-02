import re
import sys

test_data = '''
Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
'''.strip()

def parse(input):
    matches = [re.match(r'[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+).*', line) for line in input.split('\n')]
    return [{
        'rate': int(m[1]),
        'go': int(m[2]),
        'rest': int(m[3]),
        'cycle_time': int(m[2]) + int(m[3]),
        'cycle_dist': int(m[2]) * int(m[1]),
        } for m in matches]

def part1(input, time):
    reindeer = parse(input)
    distances = []
    for rd in reindeer:
        full_cycles = time // rd['cycle_time']
        full_cycle_dist = full_cycles * rd['cycle_dist']
        remaining = min([time % rd['cycle_time'], rd['go']])
        remainder_dist = remaining * rd['rate']
        distances.append(full_cycle_dist + remainder_dist)

    print(distances)
    return max(distances)

def part2(input, time):
    reindeer = parse(input)
    for r in reindeer:
        r['dist'] = 0
        r['points'] = 0
        r['flying'] = True
        r['next_toggle'] = r['go']

    for s in range(1, time + 1):
        for r in reindeer:
            if r['flying']:
                r['dist'] += r['rate']

            if s == r['next_toggle']:
                if r['flying']:
                    r['next_toggle'] += r['rest']
                else:
                    r['next_toggle'] += r['go']

                r['flying'] = not r['flying']

        lead_dist = max([r['dist'] for r in reindeer])

        for r in reindeer:
            if r['dist'] == lead_dist:
                r['points'] += 1

    return max([r['points'] for r in reindeer])



def test(input=None):
    assert(part1(test_data, 1000) == 1120)
    assert(part2(test_data, 1000) == 689)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            print('Part 1:', part1(input, 2503))
            print('Part 2:', part2(input, 2503))


