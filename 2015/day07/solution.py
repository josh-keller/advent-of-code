import re
import sys
import functools

test_data = '''
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
'''.strip()

def parse_line(line):
    # Number
    if match := re.match(r'(\w+) (AND|OR|RSHIFT|LSHIFT) (\w+) -> (\w+)', line):
        input1 = match[1]
        if re.match(r'\d+', input1):
            input1 = int(input1)

        input2 = match[3]
        if re.match(r'\d+', input2):
            input2 = int(input2)


        return (match[4], {
            'type': match[2],
            'input1': input1,
            'input2': input2,
        })
    elif match := re.match(r'(\w+) -> (\w+)', line):
        input1 = match[1]
        if re.match(r'\d+', input1):
            input1 = int(input1)

        return (match[2], {
            'type': 'input',
            'input1': input1,
        })

    elif match := re.match(r'NOT (\w+) -> (\w+)', line):
        input1 = match[1]
        if re.match(r'\d+', input1):
            input1 = int(input1)

        return (match[2], {
            'type': 'NOT',
            'input1': input1,
        })
    else:
        raise Exception(f'Parsing error: "{line}"')

def parse(input):
    lines = [parse_line(l) for l in input.split('\n')]
    tree = {}
    for l in lines:
        tree[l[0]] = l[1]
    return tree

def resolve(tree, target):
    if type(target) == int:
        return target

    node = tree[target]
    print(target, node)
    if type(node) == int:
        return node
    input1 = resolve(tree, node['input1'])

    if node['type'] == 'input':
        tree[target] = input1
        return tree[target]

    if node['type'] == 'NOT':
        tree[target] = (~ input1) & 0xFFFF
        return tree[target]

    input2 = resolve(tree, node['input2'])

    if node['type'] == 'LSHIFT':
        tree[target] = (input1 << input2) & 0xFFFF
        return tree[target]

    if node['type'] == 'RSHIFT':
        tree[target] = (input1 >> input2) & 0xFFFF
        return tree[target]

    if node['type'] == 'AND':
        tree[target] = (input1 & input2) & 0xFFFF
        return tree[target]

    if node['type'] == 'OR':
        tree[target] = (input1 | input2) & 0xFFFF
        return tree[target]


    raise Exception(f'Unknown op: {node["type"]}')

def part1(input, target):
    tree = parse(input)
    return resolve(tree, target)

def part2(input, target):
    tree = parse(input)
    p1 = resolve(tree, target)
    tree = parse(input)
    tree['b'] = { 'type': 'input', 'input1': p1}
    return resolve(tree, target)

def test():
    assert(part1(test_data, 'd') == 72)
    assert(part1(test_data, 'h') == 65412)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            print('Part 1:', part1(input, 'a'))
            print('Part 2:', part2(input, 'a'))
