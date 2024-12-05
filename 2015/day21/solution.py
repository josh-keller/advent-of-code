import sys

class Weapon(object):
    def __init__(self, name, cost, damage, armor):
        self.name = name
        self.cost = cost
        self.damage = damage
        self.armor = armor

class Fighter(object):
    def __init__(self, hit=100, damage=0, armor=0):
        self.hit = hit
        self.damage = damage
        self.armor = armor
        self.weapon = None
        self.armor = None
        self.rings = []
        self.total_spent = 0

    def buy_weapon(self, weapon):







def part1(input):
    pass

def part2(input):
    pass

def test():
    assert(False)
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


