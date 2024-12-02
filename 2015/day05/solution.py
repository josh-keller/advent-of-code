import sys

def three_vowels(s):
    vowels = ['a', 'e', 'i', 'o', 'u']
    vowel_count = 0

    for l in s:
        if l in vowels:
            vowel_count += 1
        if vowel_count >= 3:
            return True

    return False

def double_letter(s):
    for i, l in enumerate(s):
        if i >= len(s) - 1:
            break
        if l == s[i+1]:
            return True

    return False

def no_bad_pairs(s):
    return not ('ab' in s or 'cd' in s or 'pq' in s or 'xy' in s)

def nice(s):
    if not three_vowels(s):
        print('Not 3 vowels: ', s)
        return False

    if not double_letter(s):
        print('No doubles: ', s)
        return False

    if not no_bad_pairs(s):
        print('Has bad pair: ', s)
        return False

    print('Nice!: ', s)
    return True

def repeated_pair(s):
    pairs = dict()
    for i in range(len(s) - 1):
        pair = s[i:i+2]
        prev_idx = pairs.get(pair)
        if prev_idx != None and prev_idx != i - 1:
            return True

        if not prev_idx:
            pairs[pair] = i

    return False

def repeated_with_spacer(s):
    for i in range(len(s) - 2):
        print(s[i:i+3])
        if s[i] == s[i + 2]:
            return True

    return False


def nice2(s):
    if not repeated_pair(s):
        return False

    if not repeated_with_spacer(s):
        print('No repeated with spacer: ', s)
        return False

    print('Nice!: ', s)
    print('--------------------')
    return True

# 165 is too low
def part1(input):
    lines = input.split('\n')
    return len([s for s in lines if nice(s)])

# 69, 50
def part2(input):
    lines = input.split('\n')
    return len([s for s in lines if nice2(s)])

def test():
    assert(nice('ugknbfddgicrmopn') == True)
    assert(nice('aaa') == True)
    assert(nice('aedd') == False)
    assert(nice('eiab') == False)
    assert(nice('jchzalrnumimnmhp') == False)
    assert(nice('haegwjzuvuyypxyu') == False)
    assert(nice('dvszwmarrgswjxmb') == False)
    assert(nice2('qjhvhtzxzqqjkmpb') == True)
    assert(nice2('xxyxx') == True)
    assert(nice2('uurcxstgmygtbstg') == False)
    assert(nice2('ieodomkazucvgmuy') == False)
    assert(nice2('ieodomkazucvgmie') == True)
    assert(nice2('iemkazucvgmieodo') == True)
    assert(nice2('ieeeie') == True)
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
