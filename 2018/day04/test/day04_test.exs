defmodule Day04Test do
  use ExUnit.Case
  doctest Day04

  test "test1" do
    assert File.stream!("test1.txt") |> Enum.map(&String.trim/1) |> Day04.part1() == 240
  end

  test "test2" do
    assert File.stream!("test1.txt") |> Enum.map(&String.trim/1) |> Day04.part2() == 4455
  end
end
