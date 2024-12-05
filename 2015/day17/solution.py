import sys

test_input = '''
20
15
10
5
5
'''.strip()

def parse(input):
    return [int(l) for l in input.split('\n')]

def find_combinations(nums, candidate, solutions, goal):
    # print(nums)
    # print(candidate)
    # print(solutions)
    # print("------------------")
    if len(nums) == 0:
        return
    sum_so_far = sum(candidate)
    for i, num in enumerate(nums):
        if sum_so_far + num > goal:
            continue
        elif sum_so_far + num == goal:
            solution = list(candidate) + [num]
            solutions.append(solution)
        elif i == len(nums) - 1: # last element and still haven't made it
            return
        else:
            next_candidate = list(candidate) + [num]
            next_nums = nums[i+1:]
            find_combinations(next_nums, next_candidate, solutions, goal)

def part1(input, goal=150):
    nums = parse(input)
    solutions = []
    find_combinations(nums, [], solutions, goal)
    return len(solutions)

def part2(input, goal=150):
    nums = parse(input)
    solutions = []
    find_combinations(nums, [], solutions, goal)
    smallest = min([len(s) for s in solutions])
    return len([s for s in solutions if len(s) == smallest])

def test():
    assert(part1(test_input, 25) == 4)
    assert(part2(test_input, 25) == 3)
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


