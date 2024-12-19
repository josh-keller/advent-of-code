import sys

test_input = '2333133121414131402'

def part1(input):
    digits = [int(d) for d in list(test_input)]
    checksum = 0
    b_ptr = 0
    block_idx = 0
    e_ptr = len(digits) - 1
    e_file_id = e_ptr // 2
    left_at_end = digits[e_ptr]
    end_n = digits[e_ptr]

    while b_ptr < e_ptr:
        # Sum digits going forward
        b_file_id = b_ptr // 2
        n = digits[b_ptr]
        checksum += b_file_id * n * (block_idx + block_idx + n) // 2 
        b_ptr += 1
        block_idx += n

        blanks = digits[b_ptr]

        while blanks <= end_n:
            checksum += e_file_id * end_n * (block_idx + block_idx + end_n) // 2


    return digits

def part2(input):
    pass

def test():
    print(part1(test_input))
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


