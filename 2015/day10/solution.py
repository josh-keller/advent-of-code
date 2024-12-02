import sys

'''
--- Day 10: Elves Look, Elves Say ---
Today, the Elves are playing a game called look-and-say. They take turns making sequences by reading aloud the previous sequence and using that reading as the next sequence.
For example, 211 is read as "one two, two ones", which becomes 1221 (1 2, 2 1s).

Look-and-say sequences are generated iteratively, using the previous value as input for the next step.
For each step, take the previous value, and replace each run of digits (like 111) with the number of digits (3) followed by the digit itself (1).

For example:

1 becomes 11 (1 copy of digit 1).
11 becomes 21 (2 copies of digit 1).
21 becomes 1211 (one 2 followed by one 1).
1211 becomes 111221 (one 1, one 2, and two 1s).
111221 becomes 312211 (three 1s, two 2s, and one 1).
Starting with the digits in your puzzle input, apply this process 40 times. What is the length of the result?

Your puzzle input is 1321131112.
'''
def split_into_groups(str):
    groups = []
    i = 0
    while i < len(str):
        end = i + 1
        while end < len(str) and str[end] == str[i]:
            end += 1

        groups.append(str[i:end])
        i = end

    return groups


def next_str(str):
    split_str = split_into_groups(str)
    counts = [f'{len(s)}{s[0]}' for s in split_str]
    return ''.join(counts)

def part1(input):
    str = input
    for _ in range(40):
        str = next_str(str)

    return len(str)


def part2(input):
    str = input
    for _ in range(50):
        str = next_str(str)

    return len(str)

def test():
    assert(next_str('1') == '11')
    assert(next_str('11') == '21')
    assert(next_str('21') == '1211')
    assert(next_str('1211') == '111221')
    assert(next_str('111221') == '312211')
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


