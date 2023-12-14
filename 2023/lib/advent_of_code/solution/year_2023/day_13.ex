defmodule AdventOfCode.Solution.Year2023.Day13 do
  def part1(input) do
    input
    |> String.split("\n\n", trim: true)
    |> Enum.map(&find_reflection/1)
    |> Enum.reduce(0, fn {row, col}, sum -> sum + (100 * row + col) end)
  end

  def part2(input) do
    input
    |> String.split("\n\n", trim: true)
    |> Enum.map(&String.split(&1, "\n", trim: true))
    |> Enum.map(&summarize/1)
    |> Enum.reduce(0, fn {row, col}, sum -> sum + (100 * row + col) end)
  end

  def summarize(map) do
    bitstrings_row =
      map
      |> Enum.map(&to_bitstring/1)

    bitstrings_col =
      flip(map)
      |> Enum.map(&to_bitstring/1)

    {find_mirrored_bs(bitstrings_row), find_mirrored_bs(bitstrings_col)}
  end

  def find_mirrored_bs([head | tail]) do
    bs_helper([head], tail, 1)
  end

  def bs_helper(_, [], _), do: 0

  def bs_helper(top, bottom, n) do
    len = min(n, length(bottom))

    result =
      Enum.zip(Enum.take(top, len), Enum.take(bottom, len))
      |> Enum.reduce_while(false, fn {a,b}, found ->
        sum = a - b
        cond do
          sum == 0 -> {:cont, found} 
          found -> {:halt, false}
          is_pow_of_2?(sum) -> {:cont, true}
          true -> {:halt, false}
        end
      end)

    if result do
      n
    else
      [head_of_bottom | rest_of_bottom] = bottom
      bs_helper([head_of_bottom | top], rest_of_bottom, n + 1)
    end
  end

  def is_pow_of_2?(n) when n < 2, do: n == 1
  def is_pow_of_2?(n), do: is_pow_of_2?(n / 2)

  def find_reflection(map) do
    rows = String.split(map, "\n", trim: true)
    {find_mirrored(rows), find_mirrored(flip(rows))}
  end

  def to_bitstring(str) do
    str
    |> String.graphemes()
    |> Enum.reduce(0, fn char, bitstring ->
      bitstring * 2 + if char == ".", do: 0, else: 1
    end)
  end

  def flip(rows) do
    rows
    |> Enum.map(&String.graphemes/1)
    |> List.zip()
    |> Enum.map(&Tuple.to_list/1)
    |> Enum.map(&List.to_string/1)
  end

  def find_mirrored([head | tail]) do
    row_helper([head], tail, 1)
  end

  defp row_helper(_, [], _), do: 0

  defp row_helper(top, bottom, n) do
    len = min(n, length(bottom))

    if Enum.take(top, len) == Enum.take(bottom, len) do
      n
    else
      [tail_head | tail_rest] = bottom
      row_helper([tail_head | top], tail_rest, n + 1)
    end
  end
end
