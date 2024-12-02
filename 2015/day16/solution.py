import sys

test_results = {
    'children': 3,
    'cats': 7,
    'samoyeds': 2,
    'pomeranians': 3,
    'akitas': 0,
    'vizslas': 0,
    'goldfish': 5,
    'trees': 3,
    'cars': 2,
    'perfumes': 1,
}

test_input = None

def create_tuple(str):
    pair = str.split(': ')
    return (pair[0], int(pair[1]))

def parse(input):
    lines = [line for line in input.split('\n')]
    result = [line.split(': ', 1)[1] for line in lines]
    result = [dict([create_tuple(pair) for pair in line.split(', ')]) for line in result]
    return result

def part1(input):
    sues = parse(input)
    gift_sue = []
    for i, sue in enumerate(sues):
        match = True
        for item, count in sue.items():
            if test_results[item] != count:
                match = False
                break
        if match == True:
            gift_sue.append(i + 1)

    return gift_sue

def check(item, sue):
    if sue.get(item) == None:
        return True

    if item in ['cats', 'trees']:
        return sue[item] > test_results[item]
    if item in ['pomeranians', 'goldfish']:
        return sue[item] < test_results[item]

    return sue[item] == test_results[item]


def part2(input):
    sues = parse(input)
    gift_sue = []

    for i, sue in enumerate(sues):
        # if all([check(item, sue) for item in test_results.keys()]):
        #     return i + 1
        match = True
        for item, count in sue.items():
            if item in ['cats', 'trees']: 
                if count <= test_results[item]:
                    match = False
                    break
            elif item in ['pomeranians', 'goldfish']:
                if count >= test_results[item]:
                    match = False
                    break
            elif test_results[item] != count:
                match = False
                break
        if match == True:
            gift_sue.append(i + 1)

    return gift_sue

def test(input=test_input):
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            test(input)
            print('Part 1:', part1(input))
            print('Part 2:', part2(input))


