import sys

test_data = '''
Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.
'''.strip()

def parse(input):
    lines = input.split('\n')
    rules = {}
    for w in [l.rstrip('.').split(' ') for l in lines]:
        if w[0] not in rules:
            rules[w[0]] = {}

        if w[2] == 'gain':
            rules[w[0]][w[-1]] = int(w[3])
        elif w[2] == 'lose':
            rules[w[0]][w[-1]] = -int(w[3])

    return rules

def total_happiness(rules, table):
    happiness = 0
    for i, g in enumerate(table):
        l = i - 1
        happiness += rules[g][table[l]]
        r = (i + 1) % len(table)
        happiness += rules[g][table[r]]
    return happiness

def calc_happiness(rules, table, guests):
    if len(guests) == 0:
        return total_happiness(rules, table)

    best_happiness = float('-inf')
    for guest in guests:
        new_table = list(table)
        new_table.append(guest)
        happiness = calc_happiness(rules, new_table, [g for g in guests if g != guest])
        if happiness > best_happiness:
            best_happiness = happiness

    return best_happiness



def part1(input):
    rules = parse(input)
    guests = rules.keys()
    return calc_happiness(rules, [], guests)

def part2(input):
    rules = parse(input)
    rules['josh'] = { n: 0 for n in rules.keys()}
    for n in rules.keys():
        rules[n]['josh'] = 0

    guests = rules.keys()
    return calc_happiness(rules, [], guests)


def test(input):
    assert(part1(test_data) == 330)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()

        test(input)
        print('Part 1:', part1(input))
        print('Part 2:', part2(input))


