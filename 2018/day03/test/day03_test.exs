defmodule Day03Test do
  use ExUnit.Case
  doctest Day03

  test "part1" do
    result = File.stream!("test1.txt") |> Enum.map(&String.trim/1) |> Day03.part1
    assert result == 4
  end
  test "part2" do
    result = File.stream!("test1.txt") |> Enum.map(&String.trim/1) |> Day03.part2
    assert result == 3
  end
  test "all squares" do
    assert Day03.allSquares(1..2, 1..2) == [{2,2}, {2,1}, {1,2}, {1,1}]
  end
end
