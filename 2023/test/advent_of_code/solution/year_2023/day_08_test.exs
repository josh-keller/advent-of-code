defmodule AdventOfCode.Solution.Year2023.Day08Test do
  use ExUnit.Case, async: true

  import AdventOfCode.Solution.Year2023.Day08

  setup do
    [
      input: """
      RL

      AAA = (BBB, CCC)
      BBB = (DDD, EEE)
      CCC = (ZZZ, GGG)
      DDD = (DDD, DDD)
      EEE = (EEE, EEE)
      GGG = (GGG, GGG)
      ZZZ = (ZZZ, ZZZ)
      """,
      input2: """
      LLR

      AAA = (BBB, BBB)
      BBB = (AAA, ZZZ)
      ZZZ = (ZZZ, ZZZ)
      """,
      part2input: """
      LR

      11A = (11B, XXX)
      11B = (XXX, 11Z)
      11Z = (11B, XXX)
      22A = (22B, XXX)
      22B = (22C, 22C)
      22C = (22Z, 22Z)
      22Z = (22B, 22B)
      XXX = (XXX, XXX)     
      """
    ]
  end

  @tag :skip
  test "part1", %{input: input, input2: input2} do
    result = part1(input)
    assert result == 2
    result = part1(input2)
    assert result == 6
  end

  # @tag :skip
  test "part2", %{part2input: input} do
    result = part2(input)

    assert result == 6
  end
end
