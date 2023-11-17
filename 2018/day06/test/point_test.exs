defmodule PointTest do
  use ExUnit.Case
  doctest Point

  test "distance" do
    assert Point.distance(Point.new(1,1), Point.new(1,1)) == 0
    assert Point.distance(Point.new(1,1), Point.new(1,2)) == 1
    assert Point.distance(Point.new(1,2), Point.new(1,1)) == 1
    assert Point.distance(Point.new(2,2), Point.new(1,1)) == 2
  end

  test "all points x away" do
    assert Point.allXAway(Point.new(1,1), 1)
      |> Enum.sort == 
      [Point.new(0, 1), Point.new(1, 0), Point.new(2, 1), Point.new(1, 2)]
      |> Enum.sort
    assert Point.allXAway(Point.new(1,1), 2)
      |> Enum.sort == 
      [Point.new(3, 1), Point.new(-1, 1), Point.new(1, 3), Point.new(1, -1),
       Point.new(0, 2), Point.new(2, 0), Point.new(0, 0), Point.new(2, 2),
      ]
      |> Enum.sort
  end

  test "new from string" do
    assert Point.from_string("1,1") == %Point{x: 1, y: 1}
    assert Point.from_string("1, 2") == %Point{x: 1, y: 2}
    assert Point.from_string("-11, +2") == %Point{x: -11, y: 2}
  end
end
