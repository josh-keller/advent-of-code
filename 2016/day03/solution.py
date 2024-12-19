import re
import sys

def is_triangle(tri):
    t = sorted(tri)
    return t[0] + t[1] > t[2]

def part1(input):
    tris = [[int(x) for x in re.findall(r'\d+', line)] for line in input.split('\n')]
    return len([tri for tri in tris if is_triangle(tri)])

def part2(input):
    return len([tri for tri in input if is_triangle(tri)])

def test(input):
    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            tris = []
            new_tri = ([], [], [])
            for line in input.split('\n'):
                nums = [int(n) for n in re.findall(r'\d+', line)]
                print(nums)
                new_tri[0].append(nums[0])
                new_tri[1].append(nums[1])
                new_tri[2].append(nums[2])
                if len(new_tri[0]) == 3:
                    for t in new_tri:
                        tris.append(t)
                    new_tri = ([],[],[])
            print(tris)
                

            print('Part 1:', part1(input))
            print('Part 2:', part2(tris))


