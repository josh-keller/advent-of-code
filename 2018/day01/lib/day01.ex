defmodule Day01 do
  @moduledoc """
  Documentation for `Day01`.
  """

  @doc """

  ## Examples

      iex> Day01.hello()
      :world

  """
  def part1 do
    File.stream!("input.txt")
    |> Stream.map(&Integer.parse/1)
    |> Stream.map(fn x -> elem(x, 0) end)
    |> Enum.sum()
  end

  def part2 do
    File.read!("input.txt")
    |> String.trim()
    |> String.split("\n")
    |> Enum.map(&Integer.parse/1)
    |> Enum.map(fn x -> elem(x, 0) end)
    |> Stream.cycle()
    |> Enum.reduce_while({0, MapSet.new()}, &freqFind/2)

  end

  defp freqFind(change, {freq, seen}) do
    new_freq = freq + change

    cond do
      MapSet.member?(seen, new_freq) ->
        {:halt, new_freq}
      true ->
        {:cont, {new_freq, MapSet.put(seen, new_freq)}}
    end
  end
end

Day01.part2()
|> IO.puts()

