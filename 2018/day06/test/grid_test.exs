defmodule GridTest do
  use ExUnit.Case
  doctest Grid

  test "default" do
    assert Grid.new() |> Grid.get(Point.new(1,1)) == nil
    assert Grid.new(".") |> Grid.get(Point.new(1,1)) == "."
  end

  test "put and get" do
    g = Grid.new(".")
    p = Point.new(1,1)
    assert Grid.get(g, p) == "."
    g = Grid.put(g, p, "a")
    assert Grid.get(g, p) == "a"
    g = Grid.put(g, p, "b")
    assert Grid.get(g, p) == "b"
    assert g.max_x == 1
    assert g.max_y == 1

    g = Grid.put(g, Point.new(-1, -2), "n")
    assert g.max_x == 1
    assert g.max_y == 1
    assert g.min_x == -1
    assert g.min_y == -2
  end
end
