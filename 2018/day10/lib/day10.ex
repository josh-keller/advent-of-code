defmodule Day10 do
  @moduledoc """
  Documentation for `Day10`.
  """

  @doc """
  """
  def parseInput(filename) do
    filename
    |> File.stream!()
    |> Stream.map(&String.trim/1)
    |> Enum.map(fn line ->
      Regex.run(~r/position=<\s*(-?\d+),\s*(-?\d+)> velocity=<(\s*-?\d+),\s*(-?\d+)>/, line)
      |> Stream.drop(1)
      |> Stream.map(&String.trim/1)
      |> Enum.map(&String.to_integer/1)
    end)
    |> Enum.map(fn [x, y, dx, dy] -> {%{x: x, y: y}, %{dx: dx, dy: dy}} end)
    |> Enum.reduce(%{}, fn {key, val}, acc -> Map.update(acc, key, [val], fn existing -> [val | existing] end) end)
  end

  def draw(points_and_vels, {min_x, max_x}, {min_y, max_y}) do
    min_y..max_y
    |> Enum.map(fn y ->
      min_x..max_x
      |> Enum.map(&if Map.has_key?(points_and_vels, %{x: &1, y: y}), do: "#", else: ".")
      |> Enum.join("")
    end)
    |> Enum.join("\n")
  end

  def nextState(points_and_vels) do
    points_and_vels
    |> Enum.flat_map(fn {pt, vels} ->
      vels |> Enum.map(fn vel ->
        {%{x: pt.x + vel.dx, y: pt.y + vel.dy}, vel}
      end)
    end)
    |> Enum.reduce(%{}, fn {key, val}, acc -> 
      Map.update(acc, key, [val], fn existing -> [val | existing] end)
    end)
  end
end

points_and_vels = Day10.parseInput("input.txt")

# points = points_and_vels
# |> Map.keys

# x_range = points
# |> Enum.map(&(&1.x))
# |> Enum.min_max()
#
# y_range = points
# |> Enum.map(&(&1.y))
# |> Enum.min_max()
#
points_and_vels
|> Stream.iterate(fn points_and_vels -> 
   Day10.nextState(points_and_vels)
end)
# |> Stream.chunk_every(2)
# |> Stream.take_while(fn {points_and_vels, next} -> 
#      points = points_and_vels |> Map.keys
#      {y_min, y_max} = y_range = points |> Enum.map(&(&1.y)) |> Enum.min_max()
#      y_max - y_min > 10
#    end)
|> Stream.with_index()
|> Stream.take(10868)
|> Enum.each(fn {points_and_vels, idx} ->
     points = points_and_vels |> Map.keys
     x_range = points |> Enum.map(&(&1.x)) |> Enum.min_max()
     {y_min, y_max} = y_range = points |> Enum.map(&(&1.y)) |> Enum.min_max()

     if y_max - y_min < 20 do
       Day10.draw(points_and_vels, x_range, y_range) |> IO.puts
       IO.puts("-------- #{idx} -------------")
       :timer.sleep(500)
     end
   end)
# Day10.parseInput("test.txt") |> IO.inspect()
