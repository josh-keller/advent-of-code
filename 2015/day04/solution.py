import sys
import hashlib

def mine(input, zeros):
    pad = 1
    while True:
        m = hashlib.md5(f'{input}{pad}'.encode())
        if m.hexdigest()[0:zeros] == '0' * zeros:
            break
        pad += 1

    print(pad)
    print(m.hexdigest())
    return pad


def part1(input):
    return mine(input, 5)

def part2(input):
    return mine(input, 6)

def test():
    assert(part1('abcdef') == 609043)
    assert(part1('pqrstuv') == 1048970)
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


