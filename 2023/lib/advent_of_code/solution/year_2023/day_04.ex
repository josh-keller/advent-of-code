defmodule AdventOfCode.Solution.Year2023.Day04 do
  import Bitwise

  def part1(input) do
    input
    |> parse_input
    |> Enum.map(fn [have, winning] -> have &&& winning end)
    |> Enum.map(&bitcount(&1))
    |> Enum.map(&calc_card_score(&1))
    |> Enum.sum
  end

  def part2(input) do
    input
    |> parse_input
    |> Enum.map(fn [have, winning] -> have &&& winning end)
    |> Enum.map(&bitcount(&1))
    |> total_score_cards
  end

  def total_score_cards(cards) do
    cards
    |> Enum.reduce({List.duplicate(1, length(cards)), 0}, fn score, {multipliers, total} -> 
      {mult, rest_multipliers} = update_multipliers(multipliers, score)
      {rest_multipliers, total + mult}
    end)
    |> elem(1)
  end

  def update_multipliers(multipliers, score) do
    {[mult], rest_multipliers} = Enum.split(multipliers, 1)

    updated_multipliers = rest_multipliers
    |> Enum.split(score)
    |> fn {add_to, as_is} -> Enum.map(add_to, &(&1 + mult)) ++ as_is end.()

    {mult, updated_multipliers}
  end


  def calc_card_score(0), do: 0
  def calc_card_score(n), do: 2 ** (n - 1)

  def parse_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(&process_line(&1))
  end

  def process_line(line) do
    line
    |> String.split(~r/: | \| /)
    |> Enum.drop(1)
    |> Enum.map(&process_num_set(&1))
  end

  def process_num_set(nums) do
    nums
    |> String.split(~r/\s+/, trim: true)
    |> Enum.map(&String.to_integer/1)
    |> Enum.reduce(0, fn num, bs -> bs ||| (1 <<< num) end)
  end

  def bitcount(bitstring) do
    for(<<bit::1 <- :binary.encode_unsigned(bitstring)>>, do: bit)
    |> Enum.sum
  end
end
