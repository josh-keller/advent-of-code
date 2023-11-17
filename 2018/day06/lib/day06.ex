defmodule Day06 do
  @moduledoc """

  List of points
  Need the bounds (0, 0) and (maxX, maxY)

  For each point:
    - Do a flood fill algorithm
    - Add all points that are 1 away to the Q (also the fact that they are 1 away)
    - Keep track of points in a map
      %{
        p1: { closest: point, distance: dist }
      }
  Begin searching in all directions.
  For each

  """

  @doc """
  """
  def parse(lines) do
    lines
    |> Enum.map(&Point.from_string/1)
  end

  def part1(lines) do
    lines
    |> plot_on_grid
    |> fill_areas
    |> area_sizes
    # |> Enum.max_by(&elem(&1, 1))
  end

  def plot_on_grid(points) do
    points
    |> Enum.reduce(%Grid{}, fn pt, grid -> Grid.put(grid, pt, pt) end)
  end

  @doc """
  Need:
    - list of points
    - a grid with tag AND distance from that tag {"A", 0}, {tag, dist}
    - boundaries
    - map the list of points to a list of points to try to fill on the grid
    - {pt}{"A", dst}
    - 

  Repeatedly go through the original list of points
  Prune a point from the list when it has reached the boundaries or all points are taken
  """
  def fill_areas(starting_grid) do
    _fill_areas(%Grid{starting_grid | squares: %{}}, Map.keys(starting_grid.squares), 0)
    # |> Enum.reduce(starting_grid, fn {pt, tag}, grid ->
    #   points = Point.allXAway(pt, 1)
    #   Enum.reduce(points, grid, fn surround_pt, acc -> Grid.put(acc, surround_pt, tag) end)
    # end)
  end

  def _fill_areas(grid, [], _), do: grid
  def _fill_areas(grid, points, dst) do
    { new_grid, added } = 
    Enum.flat_map(points, fn orig_pt ->
      Point.allXAway(orig_pt, dst)
      |> Enum.map(fn new_pt -> {new_pt, %{dst: dst, from: orig_pt}} end)
    end)
    |> Enum.reduce({grid, MapSet.new()}, fn {new_pt, %{dst: new_dst, from: orig_pt}}, {grid, added} ->
      if !Grid.within?(grid, new_pt) do
        {grid, added}
      else
        case Grid.get(grid, new_pt) do
          nil ->
            {Grid.put(grid, new_pt, %{dst: new_dst, from: orig_pt}), MapSet.put(added, orig_pt)}

          %{from: _, dst: curr_dst} ->
            cond do
              new_dst == curr_dst ->
                {Grid.put(grid, new_pt, %{dst: curr_dst, from: :equidistant}), added}
                
              new_dst > curr_dst ->
                {grid, added}
            end
        end
      end
    end)

    _fill_areas(new_grid, MapSet.to_list(added), dst + 1)
  end

  def area_sizes(grid) do
    Map.values(grid.squares)
    |> Enum.map(&(&1.from))
    |> Enum.filter(&(&1 != :equidistant))
    |> Enum.frequencies
  end


end

File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day06.parse |> Day06.part1 |> IO.inspect
# Part 1: 7434 too high (x: 71, y: 58)
