def parse_line(line):
    target, nums = line.split(': ')
    return int(target), [int(n) for n in nums.split(' ')]

def parse(input):
    return [parse_line(line) for line in input.split('\n')]
    
def cnc(a, b):
    return int(str(a) + str(b))
    
def valid(target, n, rest):
    if rest == []:
        return n == target
    
    nextn = rest.pop(0)
    mult = n * nextn
    add = n + nextn
    con = cnc(n, nextn)

    return valid(target, mult, list(rest)) or valid(target, add, list(rest)) or valid(target, con, list(rest))

sum = 0    
for target, nums in parse(inp):
    n = nums.pop(0)
    if valid(target, n, nums):
        sum += target
    

print(sum)
