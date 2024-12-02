import sys

test_data1 = '''
""
"abc"
"aaa\\"aaa"
"\\x27"
'''.strip()

test_data2 = '''
""
"abc"
"aaa\\"aaa"
"\\x27"
'''.strip()

def extra_chars(str):
    extra = 2
    extra += len([c for c in str if c in ['"', '\\']])
    return extra

def part1(input):
    lines = input.split('\n')
    return sum([len(line) - len(eval(line)) for line in lines])

def part2(input):
    lines = input.split('\n')
    return sum([extra_chars(line) for line in lines])

def test():
    assert(part1(test_data1) == 12)
    assert(part2(test_data2) == 19)
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


