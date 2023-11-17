defmodule Point do
  defstruct x: 0, y: 0

  def new(x, y), do: %Point{x: x, y: y}
  def new([x, y]), do: %Point{x: x, y: y}
  def new({x, y}), do: %Point{x: x, y: y}

  def distance(%Point{x: x1, y: y1}, %Point{x: x2, y: y2}) do
    abs((x1 - x2) + (y1 - y2))
  end

  def add(%Point{x: x1, y: y1}, %Point{x: x2, y: y2}) do
    %Point{x: x1 + x2, y: y1 + y2}
  end

  def allXAway(%Point{} = pt, dist) when dist == 0, do: [pt]
  def allXAway(%Point{x: x, y: y}, dist) when dist == 1 do
    [new(x + 1, y), new(x - 1, y), new(x, y + 1), new(x, y - 1) ]
  end
  def allXAway(%Point{x: x, y: y}, dist) when dist > 1 do
    1..dist - 1
    |> Enum.flat_map(fn dx -> 
      dy = dist - dx
      [new(x + dx, y + dy), new(x-dx, y+dy), new(x+dx, y-dy), new(x-dx, y-dy)]
    end)
    |> Kernel.++([new(x+dist, y), new(x-dist, y), new(x, y+dist), new(x, y-dist) ])
  end

  def from_string(str) do
    str
    |> String.split(",")
    |> Enum.map(&String.trim/1)
    |> Enum.map(&String.to_integer/1)
    |> new
  end
end
