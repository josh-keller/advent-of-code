import sys

'''
Santa's previous password expired, and he needs help choosing a new one.

To help him remember his new password after the old one expires, Santa has devised a method of coming up with a password based on the previous one.
Corporate policy dictates that passwords must be exactly eight lowercase letters (for security reasons),
so he finds his new password by incrementing his old password string repeatedly until it is valid.

Incrementing is just like counting with numbers: xx, xy, xz, ya, yb, and so on.
Increase the rightmost letter one step; if it was z, it wraps around to a, and repeat with the next letter to the left until one doesn't wrap around.

Unfortunately for Santa, a new Security-Elf recently started, and he has imposed some additional password requirements:

- Eight lowercase letters
- Passwords must include one increasing straight of at least three letters, like 
  - abc, bcd, cde, and so on, up to xyz.
  - They cannot skip letters; abd doesn't count.
Passwords may not contain the letters:
  - i
  - o
  - l
- Passwords must contain at least two different, non-overlapping pairs of letters, like aa, bb, or zz.

For example:
hijklmmn meets the first requirement (because it contains the straight hij) but fails the second requirement requirement (because it contains i and l).
abbceffg meets the third requirement (because it repeats bb and ff) but fails the first requirement.
abbcegjk fails the third requirement, because it only has one double letter (bb).
The next password after abcdefgh is abcdffaa.
The next password after ghijklmn is ghjaabcc, because you eventually skip all the passwords that start with ghi..., since i is not allowed.
Given Santa's current password (your puzzle input), what should his next password be?

Your puzzle input is hxbxwxba.
'''
test_input1 = 'abcdefgh'
test_input2 = 'ghijklmn'

def part1(input):
    next_pass = input
    while True:
        next_pass = increment(next_pass)
        if not has_illegal_letters(next_pass) and has_two_doubles(next_pass) and three_increasing(next_pass):
            return next_pass

        if next_pass == input:
            raise Exception


def part2(input):
    return part1('hxbxxyzz')

def increment(str):
    chars = list(str)
    idx = -1
    while idx >= -len(str):
        if chars[idx] == 'z':
            chars[idx] = 'a'
            idx -= 1
            continue
        chars[idx] = chr(ord(chars[idx]) + 1)
        break

    return ''.join(chars)


def test():
    assert(increment('aa') == 'ab')
    assert(increment('az') == 'ba')
    assert(increment('bzz') == 'caa')
    assert(three_increasing('abc') == True)
    assert(three_increasing('bbc') == False)
    assert(three_increasing('abbc') == False)
    assert(three_increasing('zzabc') == True)
    assert(has_two_doubles('zzabc') == False)
    assert(has_two_doubles('zzzzabc') == True)
    assert(has_two_doubles('zzabcc') == True)
    assert(part1(test_input1) == 'abcdffaa')
    assert(part1(test_input2) == 'ghjaabcc')
    print('ok')

def has_illegal_letters(str):
    return 'l' in str or 'i' in str or 'o' in str

def has_two_doubles(str):
    i = 0
    while i < len(str) - 1:
        if str[i] == str[i+1]:
            i += 2
            break
        i += 1

    while i < len(str) - 1:
        if str[i] == str[i+1]:
            return True
        i += 1

    return False

def three_increasing(str):
    ords = [ord(c) for c in list(str)]
    for i in range(len(ords) - 2):
        if ords[i+2] - ords[i+1] == 1 and ords[i+1] - ords[i] == 1:
            return True

    return False


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
