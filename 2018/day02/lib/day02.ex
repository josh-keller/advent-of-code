defmodule Day02 do
  @moduledoc """
  Documentation for `Day02`.
  """

  @doc """
  """
  def count_letters(id) do
    id
    |> String.graphemes()
    |> Enum.reduce(%{}, fn char, counts ->
      counts |> Map.update(char, 1, &(&1 + 1))
    end)
  end

  def exactly(ids, times) do
    ids
    |> Enum.map(fn id ->
      id
      |> count_letters
      |> Enum.count(fn {_, count} -> count == times end)
    end)
  end

  def part1(ids) do
    twice = ids |> exactly(2) |> Enum.count(&(&1 > 0))
    thrice = ids |> exactly(3) |> Enum.count(&(&1 > 0))
    twice * thrice
  end

  def remove_at(str, idx) do
    String.slice(str, 0, idx) <> String.slice(str, idx + 1, String.length(str))
  end

  def all_substrings(str) do
    0..String.length(str) - 1
    |> Enum.map(&(remove_at(str, &1)))
  end

  def part2(ids) do
    ids
    |> Enum.reduce_while(MapSet.new(), fn id, seen ->
      id
      |> all_substrings
      |> Enum.reduce_while({:cont, seen}, fn substr, {:cont, seen2} -> 
        if MapSet.member?(seen, substr) do
          {:halt, {:halt, substr}}
        else
          {:cont, {:cont, MapSet.put(seen2, substr)}}
        end
      end)
    end)
  end
end

# File.stream!("input.txt")
# |> Day02.part1
# |> IO.inspect

File.stream!("input.txt")
|> Stream.map(&String.trim_trailing/1)
|> Day02.part2()
# |> Enum.each(&IO.inspect/1)
|> IO.inspect()
