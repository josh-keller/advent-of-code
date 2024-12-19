import sys

test_cases = [
  ('1122',3),
  ('1111', 4),
  ('1234', 0),
  ('91212129', 9),
]

test_cases_2 = [
    ('1212', 6),
    ('1221', 0),
    ('123425', 4),
    ('123123', 12),
    ('12131415', 4),
]

def part1(input):
    digits = [int(d) for d in list(input.strip())]
    sum = 0
    for i in range(len(digits) - 1):
        if digits[i] == digits[i + 1]:
            sum += digits[i]

    if digits[-1] == digits[0]:
        sum += digits[-1]

    return sum

def part2(input):
    digits = [int(d) for d in list(input.strip())]
    sum = 0
    offset = len(digits) // 2

    for i in range(len(digits)):
        if digits[i] == digits[(i + offset) % len(digits)]:
            sum += digits[i]

    return sum

def test():
    for tc in test_cases:
        assert(part1(tc[0]) == tc[1])

    for tc in test_cases_2:
        assert(part2(tc[0]) == tc[1])

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


