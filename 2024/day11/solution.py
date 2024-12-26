import sys

test_in_1 = '''125 17'''

def parse(input):
    return [int(n) for n in input.split(' ')]

def stone_to_end(stone, blinks, memo={}):
    if result := memo.get((stone, blinks)):
        return result

    if stone == 0:
        if blinks == 1:
            result = 1
        else:
            result = stone_to_end(1, blinks - 1, memo)
    else:
        s = str(stone)
        l = len(s)

        if l % 2 == 0:
            if blinks == 1:
                result = 2
            else:
                result = stone_to_end(int(s[:l//2]), blinks - 1, memo) + stone_to_end(int(s[l//2:]), blinks - 1, memo)
        else:
            if blinks == 1:
                result = 1
            else:
                result = stone_to_end(stone * 2024, blinks - 1, memo)

    memo[(stone, blinks)] = result
    return result

def part1(input, blinks=25):
    stones = parse(input)
    memo = {}
    return sum([stone_to_end(s, blinks, memo) for s in stones])

def part2(input):
    return part1(input, 75)

def test():
    assert(part1(test_in_1, 6) == 22)
    assert(part1(test_in_1, 25) == 55312)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            result1 = part1(input)
            print('Part 1:', result1)
            result2 = part2(input)
            print('Part 2:', result2)


