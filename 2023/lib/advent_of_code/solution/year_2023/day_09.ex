defmodule AdventOfCode.Solution.Year2023.Day09 do
  def part1(input) do
    input
    |> parse_input
    |> Enum.map(&next_term/1)
    |> Enum.sum
  end

  def part2(input) do
    input
    |> parse_input
    |> Enum.map(&prev_term/1)
    |> Enum.sum
  end

  def prev_term(nums) do
    nums
    |> Stream.iterate(&find_next_differences/1)
    |> Enum.take_while(fn lst -> not Enum.all?(lst, fn n -> n == 0 end) end)
    |> Enum.map(&hd/1)
    |> Enum.reverse
    |> Enum.reduce(0, fn n, prev -> n - prev end)
  end

  def next_term(nums) do
    nums
    |> Stream.iterate(&find_next_differences/1)
    |> Enum.take_while(fn lst -> not Enum.all?(lst, fn n -> n == 0 end) end)
    |> Enum.reverse
    |> Enum.map(fn lst -> Enum.reverse(lst) |> hd end)
    |> Enum.sum
  end

  def find_next_differences(nums) do
    find_next_helper(Enum.reverse(nums), [])
  end

  def find_next_helper([_], acc), do: acc
  def find_next_helper([h1, h2 | tail], acc) do
    find_next_helper([h2 | tail], [h1 - h2 | acc])
  end

  def parse_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn line -> String.split(line, " ", trim: true) end)
    |> Enum.map(fn nums -> Enum.map(nums, &String.to_integer/1) end)
  end
end
