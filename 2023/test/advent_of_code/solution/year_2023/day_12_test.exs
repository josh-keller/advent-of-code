defmodule AdventOfCode.Solution.Year2023.Day12Test do
  use ExUnit.Case, async: true

  import AdventOfCode.Solution.Year2023.Day12

  setup do
    [
      input: """
      ???.### 1,1,3
      .??..??...?##. 1,1,3
      ?#?#?#?#?#?#?#? 1,3,1,6
      ????.#...#... 4,1,1
      ????.######..#####. 1,6,5
      ?###???????? 3,2,1
      """
    ]
  end

  # @tag :skip
  test "part1", %{input: input} do
    result = part1(input)

    assert result == 21
  end

  @tag :skip
  test "part2", %{input: input} do
    result = part2(input)

    assert result
  end

  test "solve", %{input: input} do
    result = solve({"###", [3]})
    assert result == 1
    result = solve({".###", [3]})
    assert result == 1
    result = solve({".?##", [4]})
    assert result == 0
    result = solve({"??##", [4]})
    assert result == 1
    result = solve({"??##", [1,2]})
    assert result == 1
    result = solve({"??##", [1,2]})
    assert result == 1
    # result = solve({"?###????????", [3,2,1]})
    # assert result == 10
    results = 
      input
      |> String.split("\n", trim: true)
      |> Enum.map(&process_line/1)
      |> Enum.map(&solve(&1, %{}))

    assert results == [1,4,1,1,4,10]
  end
end
