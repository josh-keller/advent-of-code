defmodule Day03 do
  @moduledoc """
  Documentation for `Day03`.
  """

  @doc """

  ## Examples

      iex> Day03.parseClaim("#1 @ 1,3: 4x4")
      %{ :id => 1, :horiz => 1..4, :vert => 3..6 }

  """
  def parseClaim(str) do
    Regex.named_captures(~r/#(?<id>\d+) @ (?<x>\d+),(?<y>\d+): (?<width>\d+)x(?<height>\d+)/, str)
    |> capturesToMap
  end


  def capturesToMap(captures) do
    x = Map.get(captures, "x") |> String.to_integer
    y = Map.get(captures, "y") |> String.to_integer
    w = Map.get(captures, "width") |> String.to_integer
    h = Map.get(captures, "height") |> String.to_integer

    %{
      id: String.to_integer(captures["id"]),
      horiz: x..x+w-1,
      vert: y..y+h-1
    }
  end

  @doc """

  ## Examples


  """
  def allSquares(horiz, vert) do
    Enum.reduce(horiz, [], fn x, acc ->
      Enum.reduce(vert, [], fn y, acc -> [{x,y}| acc] end) ++ acc
    end)
  end

  def part1(input) do
    input
    |> Enum.map(&parseClaim/1)
    |> Enum.flat_map(fn %{id: id, horiz: horiz, vert: vert} -> 
      allSquares(horiz, vert)
      |> Enum.map(&({&1, id}))
    end)
    |> Enum.reduce(%{}, fn {square, id}, squares -> 
      Map.update(squares, square, [id], &([id | &1]))
    end)
    |> Enum.count(fn {_, ids} -> length(ids) > 1 end)
  end

  def part2(input) do
    claims = Enum.map(input, &parseClaim/1)
    ids = Enum.map(claims, &Map.get(&1, :id)) |> MapSet.new
    
    joined = claims
    |> Enum.flat_map(fn %{id: id, horiz: horiz, vert: vert} -> 
      allSquares(horiz, vert)
      |> Enum.map(&({&1, id}))
    end)
    |> Enum.reduce(%{}, fn {square, id}, squares -> 
      Map.update(squares, square, [id], &([id | &1]))
    end)
    |> Enum.filter(fn {_, v} -> length(v) > 1 end)
    |> Enum.reduce(MapSet.new(), fn {_, ids}, acc -> MapSet.union(acc, MapSet.new(ids)) end)

    MapSet.difference(ids, joined) |> MapSet.to_list |> List.first
  end
end

# File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day03.part1 |> IO.inspect
File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day03.part2 |> IO.inspect
