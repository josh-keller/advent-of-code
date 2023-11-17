defmodule Grid do
  defstruct default: nil, min_x: 0, min_y: 0, max_x: 0, max_y: 0, strict: false, squares: %{}

  def new(default \\nil), do: %Grid{default: default}

  def get(%Grid{squares: squares, default: default}, %Point{} = point) do
    Map.get(squares, point, default)
  end

  def put(%Grid{} = grid, %Point{} = point, value) do
    %Grid{
      grid |
      min_x: min(grid.min_x, point.x),
      min_y: min(grid.min_y, point.y),
      max_x: max(grid.max_x, point.x),
      max_y: max(grid.max_y, point.y),
      squares: Map.put(grid.squares, point, value)}
  end

  def update(%Grid{} = grid, %Point{} = point, default, fun) do
    %Grid{grid | squares: Map.update(grid.squares, point, default, fun)}
  end

  def within?(%Grid{min_x: min_x, min_y: min_y, max_x: max_x, max_y: max_y}, %Point{x: x, y: y}) do
    min_x <= x && x <= max_x && min_y <= y && y <= max_y
  end

  # def count(grid), do: map_size(grid)
  # def member?(grid, %Point{} = pt), do: Map.has_key?(grid.squares, pt)
  # def slice()
end
