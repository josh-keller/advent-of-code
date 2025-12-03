const std = @import("std");
const expectEqual = std.testing.expectEqual;
const expectEqualSlices = std.testing.expectEqualSlices;
const testAllocator = std.testing.allocator;

const test_input_1 = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";

test "invalid1" {
    try expectEqual(true, invalid1(11));
    try expectEqual(true, invalid1(22));
    try expectEqual(true, invalid1(99));
    try expectEqual(true, invalid1(1010));
    try expectEqual(true, invalid1(1188511885));
    try expectEqual(true, invalid1(222222));
    try expectEqual(false, invalid1(333));
    try expectEqual(false, invalid1(1698522));
    try expectEqual(true, invalid1(446446));
    try expectEqual(false, invalid1(1212121212));
}

fn invalid1(n: u64) !bool {
    var buf: [64]u8 = undefined;
    const str = try std.fmt.bufPrint(&buf, "{}", .{n});
    // test length (if odd return false)
    if (@mod(str.len, 2) == 1) return false;
    const mid = str.len / 2;
    return std.mem.eql(u8, str[0..mid], str[mid..]);
}

fn allEqual(str: []u8, subStrLen: usize) !bool {
    if (@mod(str.len, subStrLen) != 0) return false;

    const first = str[0..subStrLen];
    var start = subStrLen;
    var end = subStrLen + subStrLen;
    while (end <= str.len) {
        if (! std.mem.eql(u8, first, str[start..end])) {
            return false;
        }
        start += subStrLen;
        end += subStrLen;
    } else {
        return true;
    }
}

fn invalid2(n: u64) !bool {
    var buf: [64]u8 = undefined;
    const str = try std.fmt.bufPrint(&buf, "{}", .{n});
    const maxSubLen = str.len / 2;

    for (1..maxSubLen+1) |subLen| {
        if (try allEqual(str, subLen)) return true;
    } else {
        return false;
    }
}

fn invalidInRange(allocator: std.mem.Allocator, start: u64, end: u64, testFn: *const fn (u64) anyerror!bool) ![]u64 {
    var list = std.array_list.Managed(u64).init(allocator);
    defer list.deinit();
    for (start..end+1) |n| {
        if (try testFn(n)) {
            try list.append(n);
        }
    }
    return try list.toOwnedSlice();
}

const TestCase = struct {
    start: u64,
    end: u64,
    expected: []const u64
};

test "invalid1 in range" {
    const testCases = [_]TestCase{
        .{ .start = 11, .end = 22, .expected = &.{11, 22} },
        .{ .start = 99, .end = 115, .expected = &.{99} },
        .{ .start = 998, .end = 1012, .expected = &.{1010} },
        .{ .start = 1188511880, .end = 1188511890, .expected = &.{1188511885}},
        .{ .start = 222220, .end = 222224, .expected = &.{222222}},
        .{ .start = 1698522, .end = 1698528, .expected = &.{}},
        .{ .start = 446443, .end = 446449, .expected = &.{446446}},
        .{ .start = 38593856, .end = 38593862, .expected = &.{38593859}},
        .{ .start = 565653, .end = 565659, .expected = &.{}},
        .{ .start = 824824821, .end = 824824827, .expected = &.{}},
        .{ .start = 2121212118, .end = 2121212124, .expected = &.{}},
    };

    for (testCases) |tc| {
        const answer = try invalidInRange(testAllocator, tc.start, tc.end, invalid1);
        defer testAllocator.free(answer);
        try expectEqualSlices(u64, tc.expected, answer);
    }
}

test "invalid2 in range" {
    const testCases = [_]TestCase{
        .{ .start = 11, .end = 22, .expected = &.{11, 22} },
        .{ .start = 99, .end = 115, .expected = &.{99, 111} },
        .{ .start = 998, .end = 1012, .expected = &.{999, 1010} },
        .{ .start = 1188511880, .end = 1188511890, .expected = &.{1188511885}},
        .{ .start = 222220, .end = 222224, .expected = &.{222222}},
        .{ .start = 1698522, .end = 1698528, .expected = &.{}},
        .{ .start = 446443, .end = 446449, .expected = &.{446446}},
        .{ .start = 38593856, .end = 38593862, .expected = &.{38593859}},
        .{ .start = 565653, .end = 565659, .expected = &.{565656}},
        .{ .start = 824824821, .end = 824824827, .expected = &.{824824824}},
        .{ .start = 2121212118, .end = 2121212124, .expected = &.{2121212121}},
    };

    for (testCases) |tc| {
        const answer = try invalidInRange(testAllocator, tc.start, tc.end, invalid2);
        defer testAllocator.free(answer);
        try expectEqualSlices(u64, tc.expected, answer);
    }
}

test "part1" {
    try std.testing.expectEqual(1227775554, part1(testAllocator, test_input_1));
}

test "part2" {
    try std.testing.expectEqual(4174379265, part2(testAllocator, test_input_1));
}

fn runner(allocator: std.mem.Allocator, input: []const u8, part: u8) !u64 {
    var testFn: *const fn (u64) anyerror!bool = undefined;
    if (part == 2) {
        testFn = invalid2;
    } else {
        testFn = invalid1;
    }

    var ranges = std.mem.splitScalar(u8, std.mem.trimRight(u8, input, " \n\t\r"), ',');
    var sum: u64 = 0;
    while (ranges.next()) |range| {
        var start_and_end = std.mem.splitScalar(u8, range, '-');
        if (range.len == 0) continue;
        const start = try std.fmt.parseInt(u64, start_and_end.next().?, 10);
        const end_str = start_and_end.next().?;
        const end = try std.fmt.parseInt(u64, end_str, 10);
        const invalid_ids = try invalidInRange(allocator, start, end, testFn);
        for (invalid_ids) |id| {
            sum += id;
        }
        allocator.free(invalid_ids);
    }
    return sum;
}

fn part1(allocator: std.mem.Allocator, input: []const u8) !u64 {
    return try runner(allocator, input, 1);
}
fn part2(allocator: std.mem.Allocator, input: []const u8) !u64 {
    return try runner(allocator, input, 2);
}

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    const input = @embedFile("./input");
    const result1 = try part1(allocator, input);
    std.debug.print("Part 1: {d}\n", .{result1});

    const result2 = try part2(allocator, input);
    std.debug.print("Part 2: {d}\n", .{result2});
}
