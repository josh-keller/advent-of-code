import sys
import json

def sum_nums(input):
    if type(input) == int:
        return input
    if type(input) == list:
        return sum([sum_nums(item) for item in input])
    if type(input) == dict:
        return sum([sum_nums(val) for val in input.values()])
    if type(input) == str:
        return 0
    
    print(type(input))
    raise Exception

def sum_nums_no_red(input):
    if type(input) == int:
        return input
    if type(input) == list:
        return sum([sum_nums_no_red(item) for item in input])
    if type(input) == dict:
        if "red" in input.values():
            return 0
        return sum([sum_nums_no_red(val) for val in input.values()])
    if type(input) == str:
        return 0
    
    print(type(input))
    raise Exception

def part1(input):
    return sum_nums(input)

def part2(input):
    return sum_nums_no_red(input)

def test():
    # assert(False)
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = json.load(f)
            # input = f.read().strip()
            
            print('Part 1:', part1(input))
            print('Part 2:', part2(input))


