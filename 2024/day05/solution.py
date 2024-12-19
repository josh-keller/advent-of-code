import functools
import sys

def parse(input):
    sp = input.split('\n\n')
    rules = {}
    for line in sp[0].split('\n'):
        parts = line.split('|')
        num = int(parts[0])
        if not rules.get(num):
            rules[num] = []
        rules[num].append(int(parts[1]))

    lst = [[int(n) for n in l.split(',')] for l in sp[1].split('\n')]

    return rules, lst

def middle(l):
    return l[len(l) // 2]

def valid(l, rules):
    seen = set()
    for n in l:
        for forbidden in rules.get(n, []):
            if forbidden in seen:
                return False
        seen.add(n)
    return True

def part1(input):
    rules, lsts = parse(input)
    valid_middles = [middle(l) for l in lsts if valid(l, rules)]
    return sum(valid_middles)

def make_key_func(rules):
    def comp(a, b):
        if b in rules.get(a, []):
            return -1
        elif a in rules.get(b, []):
            return 1
        else:
            return 0
    return functools.cmp_to_key(comp)

def part2(input):
    rules, lsts = parse(input)
    key_func = make_key_func(rules)
    fixed = [sorted(l, key=key_func) for l in lsts if not valid(l, rules)]
    return sum([middle(l) for l in fixed])

def test():
    assert(part1(test_input) == 143)
    assert(part2(test_input) == 123)
    print('ok')

test_input = '''
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
'''.strip()

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
