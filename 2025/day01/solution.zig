const std = @import("std");

const test_input_1 =
    \\L68
    \\L30
    \\R48
    \\L5
    \\R60
    \\L55
    \\L1
    \\L99
    \\R14
    \\L82
;

test "part 1" {
    try std.testing.expectEqual(3, part1(test_input_1));
}

test "part 2" {
    try std.testing.expectEqual(6, part2(test_input_1));
    try std.testing.expectEqual(10, part2("R1000"));
}

const Direction = enum {
    L,
    R,
};

const Instruction = struct {
    dir: Direction,
    clicks: u32,
};

fn part1(input: []const u8) !u32 {
    var n: i32 = 50;
    var zero_count: u32 = 0;
    var iter = std.mem.splitScalar(u8, input, '\n');

    while (iter.next()) |line| {
        if (line.len == 0) continue;
        const dir = line[0];
        var num: i32 = try std.fmt.parseInt(i32, line[1..], 10);

        if (dir == 'R') {
            num = -num;
        }
        n = @mod(n + num, 100);
        if (n == 0) {
            zero_count += 1;
        }
    }

    return zero_count;
}

fn part2(input: []const u8) !i32 {
    var n: i32 = 50;
    var zero_count: i32 = 0;
    var iter = std.mem.splitScalar(u8, input, '\n');

    while (iter.next()) |line| {
        if (line.len == 0) continue;
        const dir = line[0];
        var num: i32 = try std.fmt.parseInt(i32, line[1..], 10);
        zero_count += @divFloor(num, 100);
        num = @rem(num, 100);

        if (dir == 'R') {
            num = -num;
            // Account for moving into negative from 0 (but not double counting the zero);
            if (n == 0) {
                n = 100;
            }
        }

        n += num;

        if (n <= 0 or n >= 100) {
            zero_count += 1;
        }
        n = @mod(n, 100);
    }

    return zero_count;
}

pub fn main() !void {
    const input = @embedFile("./input");
    const result1 = try part1(input);
    std.debug.print("Part 1: {d}\n", .{result1});
    const result2 = try part2(input);
    std.debug.print("Part 2: {d}\n", .{result2});
}
