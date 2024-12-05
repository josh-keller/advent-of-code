import sys

test_input1 = '''
H => HO
H => OH
O => HH

HOH
'''.strip()

test_input2 = '''
H => HO
H => OH
O => HH

HOHO
'''.strip()

def parse(input):
    parts = input.split('\n\n')
    raw_rules = [(p[0], p[1]) for p in [line.split(' => ') for line in parts[0].split('\n')]]
    rules = {}
    for rule in raw_rules:
        rules[rule[0]] = rules.get(rule[0], []) + [rule[1]]

    return rules, parts[1]
    
def replace(mol, rules):
    replacements = []
    for c in list(mol):
        replacements.append(rules.get(c, [c]))

    



def part1(input):
    subs, molecule = parse(input)
    print(subs, molecule)
    pass

def part2(input):
    pass

def test():
    assert(part1(test_input1) == 4)
    assert(part1(test_input2) == 7)
    assert(False)
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


