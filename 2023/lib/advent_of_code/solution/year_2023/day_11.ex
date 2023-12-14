defmodule AdventOfCode.Solution.Year2023.Day11 do
  def part1(input) do
    input
    |> parse_input
    |> shortest_distances
    |> Enum.sum
  end

  def part2(input, factor \\ 1000000) do
    input
    |> parse_input(factor)
    |> shortest_distances
    |> Enum.sum
  end

  def shortest_distances(grid) do
    dist_helper(Map.keys(grid), [])
  end

  defp dist_helper([], distances), do: distances

  defp dist_helper([{x1, y1} | galaxies], distances) do
    new_distances = Enum.map(galaxies, fn {x2, y2} -> abs(x1 - x2) + abs(y1 - y2) end)
    dist_helper(galaxies, new_distances ++ distances)
  end

  def parse_input(input, factor \\ 2) do
    input
    |> String.split("\n", trim: true)
    |> Enum.reduce({[], 0}, fn line, {lines, idx} -> 
      if String.contains?(line, "#") do
        {[{line, idx} | lines], idx+1}
      else
        {[{line, idx} | lines], idx+factor}
      end
    end)
    |> elem(0)
    |> Enum.reverse
    |> Enum.reduce(%{}, &reduce_line/2)
    |> expand_cols(factor)
  end

  def reduce_line({line, y}, grid) do
    line
    |> String.graphemes()
    |> Enum.with_index()
    |> Enum.reduce(grid, fn {char, x}, acc ->
      if char != ".", do: Map.put(acc, {x, y}, char), else: acc
    end)
  end

  def expand_cols(grid, factor) do
    max_x = Map.keys(grid) |> Enum.map(&elem(&1, 0)) |> Enum.max
    _expand_cols(grid, 0, max_x, %{}, 0, factor)
  end

  defp _expand_cols(_grid, curr_x, max_x, new_grid, _shift, _factor) when curr_x > max_x, do: new_grid
  defp _expand_cols(grid, curr_x, max_x, new_grid, shift, factor) do
    y_coords = Map.keys(grid) |> Enum.filter(fn {x, _} -> x == curr_x end) |> Enum.map(&elem(&1, 1))

    if length(y_coords) == 0 do
      _expand_cols(grid, curr_x+1, max_x, new_grid, shift+factor-1, factor)
    else
      updated_new_grid = Enum.reduce(y_coords, new_grid, fn y, n_grid -> 
        Map.put(n_grid, {curr_x+shift, y}, "#")
      end)

      _expand_cols(grid, curr_x+1, max_x, updated_new_grid, shift, factor)
    end
  end
end
