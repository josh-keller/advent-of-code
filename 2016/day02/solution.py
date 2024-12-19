import sys

input_test = '''
ULL
RRDDD
LURDL
UUUUD
'''.strip()

part2_keypad = [
    '..1..',
    '.234.',
    '56789',
    '.ABC.',
    '..D..',
]

def next_num2(pt, d):
    if d == 'U':
        if pt[0] - 1 < 0 or part2_keypad[pt[0] - 1][pt[1]] == '.':
            return pt
        return (pt[0] - 1, pt[1])
    if d == 'D':
        if pt[0] + 1 >= 5 or part2_keypad[pt[0] + 1][pt[1]] == '.':
            return pt
        return (pt[0] + 1, pt[1])
    if d == 'L':
        if pt[1] - 1 < 0 or part2_keypad[pt[0]][pt[1] - 1] == '.':
            return pt
        return (pt[0], pt[1] - 1)
    if d == 'R':
        if pt[1] + 1 >= 5 or part2_keypad[pt[0]][pt[1] + 1] == '.':
            return pt
        return (pt[0], pt[1] + 1)

def next_num(num, d):
    if d == 'U':
        if num <= 3:
            return num
        return num - 3
    if d == 'D':
        if num >= 7:
            return num
        return num + 3
    if d == 'L':
        if num % 3 == 1:
            return num
        return num - 1
    if d == 'R':
        if num % 3 == 0:
            return num
        return num + 1

def part1(input):
    num = 5
    pin = []

    for line in input.split('\n'):
        for d in list(line):
            num = next_num(num, d)
        pin.append(num)

    return ''.join([str(n) for n in pin])

def part2(input):
    pt = (2,0)
    pin = []

    for line in input.split('\n'):
        for d in list(line):
            pt = next_num2(pt, d)
        pin.append(part2_keypad[pt[0]][pt[1]])

    print(pin)

    return ''.join([n for n in pin])

def test():
    assert(part1(input_test) == '1985')
    assert(part2(input_test) == '5DB3')
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


