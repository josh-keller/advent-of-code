const std = @import("std");
const expectEqual = std.testing.expectEqual;
const dayInput = @embedFile("./input");

const test_input_1 =
    \\987654321111111
    \\811111111111119
    \\234234234234278
    \\818181911112111
;

test "highest joltage 1" {
    try expectEqual(98, highestJoltage("987654321111111", 2));
    try expectEqual(89, highestJoltage("811111111111119", 2));
    try expectEqual(78, highestJoltage("234234234234278", 2));
    try expectEqual(92, highestJoltage("818181911112111", 2));
}

// Look at all but the last digit. Start at 9, decending to 1. Find the highest, leftmost digit you can.
// Then do the same with the remaining digits after the leftmost, highest digit.
// Put them together and parse into a number.

const ReturnTuple = std.meta.Tuple(&.{u8, usize});

fn highestRemainingChar(str: []const u8) !ReturnTuple {
    var char: u8 = '9';
    while (char >= '1') : (char -= 1) {
        for (str[0..], 0..str.len) |c, i| {
            if (char == c) return .{c, i};
        }
    } else unreachable;
}

fn highestJoltage(str: []const u8, subLen: usize) !u64 {
    var accumulator: u64 = 0;
    var step: usize = 1;
    var startIdx: usize = 0;
    // std.debug.print("-- {s} --\n", .{str});
    while (step <= subLen) : (step += 1) {
        const trimFromEnd = subLen - step;
        const digit, const idx = try highestRemainingChar(str[startIdx..str.len-trimFromEnd]);
        // std.debug.print("[{d}..{d}] {s} -> {d}: {c}\n", .{ startIdx, str.len-trimFromEnd, str[startIdx..str.len-trimFromEnd], idx, digit});
        startIdx += idx + 1;
        accumulator = (accumulator * 10) + (digit - '0');
    }
    return accumulator;
}

test "highest joltage 12" {
    try expectEqual(987654321111, highestJoltage("987654321111111", 12));
    try expectEqual(811111111119, highestJoltage("811111111111119", 12));
    try expectEqual(434234234278, highestJoltage("234234234234278", 12));
    try expectEqual(888911112111, highestJoltage("818181911112111", 12));
}
test "part 2" {
    try expectEqual(3121910778619, part2(test_input_1));
}

test "sum of joltages (test 1)" {
    try expectEqual(357, part1(test_input_1));
}

fn part1(input: []const u8) !u64 {
    const trimmed = std.mem.trimRight(u8, input, "\n");
    var iter = std.mem.splitScalar(u8, trimmed, '\n');
    var sum: u64 = 0;

    while (iter.next()) |line| {
        sum += try highestJoltage(line, 2);
    }
    return sum;
}

fn part2(input: []const u8) !u64 {
    const trimmed = std.mem.trimRight(u8, input, "\n");
    var iter = std.mem.splitScalar(u8, trimmed, '\n');
    var sum: u64 = 0;

    while (iter.next()) |line| {
        sum += try highestJoltage(line, 12);
    }
    return sum;
}

pub fn main() !void {
    std.debug.print("Part 1: {d}\n", .{ try part1(dayInput) });
    std.debug.print("Part 2: {d}\n", .{ try part2(dayInput) });
}
