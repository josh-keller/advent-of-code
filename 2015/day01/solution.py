# Start on floor 0
# ( goes up one floor
# ) goes down one floor

import sys

def floor(str):
    f = 0
    for c in str:
        if c == '(':
            f += 1
        elif c == ')':
            f -= 1
        else:
            raise ValueError

    return f

def basement(str):
    f = 0
    p = 0
    for c in str:
        p += 1
        if c == '(':
            f += 1
        elif c == ')':
            f -= 1
        else:
            raise ValueError
        if f == -1:
            return p
    raise "Did not reach basement"


def test():
    assert(floor('(())') == 0)
    assert(floor('()()') == 0)
    assert(floor('(((') == 3)
    assert(floor('(()(()(') == 3)
    assert(floor('))(((((') == 3)
    assert(floor('())') == -1)
    assert(floor('))(') == -1)
    assert(floor(')))') == -3)
    assert(floor(')())())') == -3)
    assert(basement(')') == 1)
    assert(basement('()())') == 5)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read()
            print('Part 1:', floor(input))
            print('Part 2:', basement(input))
