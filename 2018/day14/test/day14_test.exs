defmodule Day14Test do
  use ExUnit.Case
  doctest Day14

  @tag :skip
  test "part 1" do
    assert Day14.part1(9) == 5158916779
    assert Day14.part1(5) == 0124515891
    assert Day14.part1(18) == 9251071085
    assert Day14.part1(2018) == 5941429882
  end

  test "part 2" do
    assert Day14.part2(51589) == 9
    # assert Day14.part2(01245) == 5
    assert Day14.part2(92510) == 18
    assert Day14.part2(59414) == 2018
  end
end
