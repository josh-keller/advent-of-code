defmodule AdventOfCode.Solution.Year2023.Day01 do
  @number_words %{
    "one" => "1e",
    "two" => "2o",
    "three" => "3e",
    "four" => "4",
    "five" => "5e",
    "six" => "6",
    "seven" => "7n",
    "eight" => "8t",
    "nine" => "9e"
  }

  @number_words_regex ~r/one|two|three|four|five|six|seven|eight|nine/

  def part1(input) do
    input
    |> String.split("\n", trim: true)
    |> calculation_value_sum
  end

  def part2(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(&convert_numeric_words/1)
    |> calculation_value_sum
  end

  def calculation_value_sum(input) do
    input
    |> Enum.map(&remove_non_nums/1)
    |> Enum.map(&first_and_last/1)
    |> Enum.map(&Integer.undigits/1)
    |> Enum.sum()
  end

  defp convert_numeric_words(str) do
    new_str = String.replace(str, @number_words_regex, &(@number_words[&1]), global: true)
    if new_str == str, do: new_str, else: convert_numeric_words(new_str)
  end

  def remove_non_nums(str) do
    str
    |> String.codepoints()
    |> Enum.filter(&String.contains?("0123456789", &1))
    |> Enum.map(&String.to_integer/1)
  end

  def first_and_last(nums) do
    [List.first(nums), List.last(nums)]
  end
end
