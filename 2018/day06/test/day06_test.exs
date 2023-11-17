defmodule Day06Test do
  use ExUnit.Case
  doctest Day06

  test "parses input" do
    assert Day06.parse(["1, 1", "1, 6"]) == [%Point{x: 1, y: 1}, %Point{x: 1, y: 6}]
  end
end
