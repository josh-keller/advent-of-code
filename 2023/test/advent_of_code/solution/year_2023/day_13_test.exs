defmodule AdventOfCode.Solution.Year2023.Day13Test do
  use ExUnit.Case, async: true

  import AdventOfCode.Solution.Year2023.Day13

  setup do
    [
      input: """
      #.##..##.
      ..#.##.#.
      ##......#
      ##......#
      ..#.##.#.
      ..##..##.
      #.#.##.#.
      
      #...##..#
      #....#..#
      ..##..###
      #####.##.
      #####.##.
      ..##..###
      #....#..#
      """
    ]
  end

  # @tag :skip
  test "part1", %{input: input} do
    result = part1(input)

    assert result == 405
  end

  # @tag :skip
  test "part2", %{input: input} do
    result = part2(input)

    assert result == 400
  end
end
