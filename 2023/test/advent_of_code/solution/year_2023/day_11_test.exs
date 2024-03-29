defmodule AdventOfCode.Solution.Year2023.Day11Test do
  use ExUnit.Case, async: true

  import AdventOfCode.Solution.Year2023.Day11

  setup do
    [
      input: """
      ...#......
      .......#..
      #.........
      ..........
      ......#...
      .#........
      .........#
      ..........
      .......#..
      #...#.....
      """
    ]
  end

  test "part1", %{input: input} do
    result = part1(input)

    assert result == 374
  end

  # @tag :skip
  test "part2", %{input: input} do
    result = part2(input, 10)
    assert result == 1030

    result = part2(input, 100)
    assert result == 8410
  end
end
