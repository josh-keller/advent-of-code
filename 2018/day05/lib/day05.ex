defmodule Day05 do
  @moduledoc """
  Documentation for `Day05`.
  """

  @doc """
  """
  def same_type?(a, b) when is_integer(a) and is_integer(b) do
    Bitwise.&&&(a, 0x1F) == Bitwise.&&&(b, 0x1F)
  end

  def same_polarity?(a, b) when is_integer(a) and is_integer(b) do
    Bitwise.&&&(a, 0x30) == Bitwise.&&&(b, 0x30)
  end

  def will_react?(a, b), do: same_type?(a, b) and not same_polarity?(a, b)

  def react(str) do
    str
    |> String.to_charlist()
    |> _react()
    |> List.to_string()
  end

  def _react(units) do
    reduced =
      units
      |> Enum.chunk_every(2, 1)
      |> Enum.flat_map_reduce(false, &reducer/2)
      |> elem(0)

    if length(reduced) == length(units) do
      reduced
    else
      _react(reduced)
    end
  end

  def reducer(_, true), do: {[], false}
  def reducer([a], false), do: {[a], false}

  def reducer([a, b], false) do
    cond do
      will_react?(a, b) ->
        {[], true}

      true ->
        {[a], false}
    end
  end

  def part1([input]), do: react(input) |> String.length()
  def part2([input]) do
    input
    |> letters_removed()
    |> Enum.map(fn str -> str |> react |> String.length end)
    |> Enum.min
    # |> Enum.min_by(fn str -> str |> react() |> String.length() end)
  end

  @doc """
  ## Examples
    
    iex> Day05.is_letter?(?a)
    true

    iex> Day05.is_letter?("a")
    false
  """
  def is_letter?(code_point) do
    is_integer(code_point) and code_point >= 65 and Bitwise.&&&(code_point, 0x1F) <= 26
  end

  def run(part, filename \\ "input.txt") do
    File.stream!(filename) |> Enum.map(&String.trim/1) |> runPart(part) |> IO.inspect()
  end

  def runPart(input, part) do
    case part do
      1 ->
        part1(input)

      2 ->
        part2(input)
    end
  end

  def letters_removed(str) do
    str
    |> String.downcase()
    |> String.graphemes()
    |> Enum.uniq()
    |> Enum.map(fn letter -> remove_letter(str, letter) end)
  end

  def remove_letter(str, letter) do
    re = Regex.compile!(letter, "i")

    str
    |> String.replace(re, "")
  end
end

# Day05.run(1)
Day05.run(2)
