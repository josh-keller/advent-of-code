import sys

test_input = '2333133121414131402'

def make_blocks(digits):
    file_id = 0
    is_file = True
    blocks = []

    for d in digits:
        if is_file:
            contents = {
                'id': file_id,
                'size': d
            }
            file_id += 1
        else:
            contents = {
                'id': None,
                'size': d
            }

        blocks.append(contents)
        is_file = not is_file

    return blocks

def blocks_to_str(blocks, sep=''):
    str_blocks = []
    for b in blocks:
        if b['id'] == None:
            str_blocks.append('.' * b['size'])
        else:
            str_blocks.append(str(b['id']) * b['size'])
    return sep.join(str_blocks)

def blocks_to_list(blocks):
    block_list = []
    for b in blocks:
        if b['id'] == None:
            block_list += [None] * b['size']
        else:
            block_list += [b['id']] * b['size']
    return block_list

    print(blocks_to_list(blocks))
def part1(input):
    digits = [int(d) for d in list(input)]
    blocks = blocks_to_list(make_blocks(digits))

    head = 0
    tail = len(blocks) - 1

    while head < tail:
        while blocks[tail] == None:
            tail -= 1

        if blocks[head] == None:
            blocks[head], blocks[tail] = blocks[tail], None
            tail -= 1
        head += 1

    return sum([i * n for i, n in enumerate(blocks) if n != None])

def part2(input):
    digits = [int(d) for d in list(input)]
    blocks = make_blocks(digits)
    blocks_to_move = sorted([b for b in blocks if b['id'] != None], key=lambda b: b['id'], reverse=True)
    for b_mv in blocks_to_move:
        rem_idx = next(i for i,b in enumerate(blocks) if b['id'] == b_mv['id'])
        # print("Block to move:", b_mv)
        # print("  rem_idx:", rem_idx)
        try:
            idx = next(i for i,b in enumerate(blocks[:rem_idx]) if b['id'] == None and b['size'] >= b_mv['size'])
            # print("  idx:", idx)
            cp = b_mv.copy()
            blocks[rem_idx]['id'] = None
            # If they are the same size, replace blocks[idx] with b
            if cp['size'] == blocks[idx]['size']:
                blocks[idx]['id'] = cp['id']
            else:
                blocks[idx]['size'] -= cp['size']
                blocks.insert(idx, cp)
        except:
            continue
    # print('|'.join(map(lambda b: str(b) if b != None else '.', blocks_to_list(blocks))))
    return sum([i * n for i, n in enumerate(blocks_to_list(blocks)) if n != None])
        


def test():
    assert(part1(test_input) == 1928)
    assert(part2(test_input) == 2858)

    print('ok')

if __name__ == "__main__":
    if len(sys.argv) == 1:
        test()
    else:
        test()
        filename = sys.argv[1]
        with open(filename, 'r') as f:
            input = f.read().strip()
            result1 = part1(input)
            assert(result1 == 6201130364722)
            print('Part 1:', part1(input))
            result2 = part2(input)
            if result2 in [83657101056, 6212065744242]:
                print(f'Part 2: {result2} already submitted and incorrect')
                print(83657101056, 'was too low')
                print(6212065744242, 'was too low')
            print('Part 2:', result2)


