# Written on my phone while traveling

def parse(input):
    lines = input.split('\n')
    w = len(lines[0])
    h = len(lines)
    m = {}
    others = set()
    for r, l in enumerate(lines):
        for c, char in enumerate(l):
            if char == '.':
                continue
            if not m.get(char):
                m[char] = []
            
            for c1, r1 in m[char]:
                rd = r1 - r
                cd = c1 - c
                r2 = r1
                c2 = c1
                while 0 <= r2 < h and 0 <= c2 < w:
                    others.add((c2, r2))
                    r2 += rd
                    c2 += cd
                r3 = r
                c3 = c
                while 0 <= r3 < h and 0 <= c3 < w:
                    others.add((c3,r3))
                    r3 -= rd
                    c3 -= cd
                
                
            m[char].append((c, r))

    return len(others)
