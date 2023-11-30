defmodule Day14 do
  @moduledoc """
  Documentation for `Day14`.
  """

  @doc """
  """
  def part1(input) do
    recipes = %{0 => 3, 1 => 7}
    elves = {0, 1}
    
    Stream.iterate({recipes, elves}, fn {recipes, elves} ->
      next_round({recipes, elves})
    end)
    |> Enum.take_while(fn {recipes, _} -> map_size(recipes) <= input + 11 end)
    |> List.last
    |> elem(0)
    |> Enum.sort
    |> Enum.drop(input)
    |> Enum.take(10)
    |> Enum.map(&elem(&1, 1))
    |> Integer.undigits
  end

  def part2(input) do
    recipes = %{0 => 3, 1 => 7}
    elves = {0, 1}
    input_len = input |> Integer.digits |> length
    
    Stream.iterate({recipes, elves}, fn {recipes, elves} ->
      next_round({recipes, elves})
    end)
    |> Enum.reduce_while(nil, fn {recipes, _}, _ ->
      recipe_len = map_size(recipes)
      start = recipe_len - input_len - 1
      start = if start < 0, do: 0, else: start
      
      num = start..recipe_len - 1
      |> Enum.reduce(0, fn idx, acc -> 
        (acc * 10) + recipes[idx]
      end)

      cond do
        input == div(num, 10) ->
          IO.puts("almost last digits: #{num}")
          {:halt, recipe_len - input_len - 1}
        input == rem(num, 10 ** input_len) ->
          IO.puts("last digits: #{num}")
          {:halt, recipe_len - input_len}
        true ->
          {:cont, nil}
      end
    end)
  end

  def next_recipes(recipes, {elf1, elf2}) do
    sum = recipes[elf1] + recipes[elf2]
    len = map_size(recipes)
    Integer.digits(sum)
    |> Enum.with_index
    |> Enum.reduce(recipes, fn {digit, idx}, recipes -> 
      Map.put(recipes, len + idx, digit)
    end)
  end

  def choose_next_recipe(recipes, {elf1, elf2}) do
    len = map_size(recipes)
    elf1_move_by = recipes[elf1] + 1
    elf2_move_by = recipes[elf2] + 1

    {rem(elf1 + elf1_move_by, len), rem(elf2 + elf2_move_by, len)}
  end

  def next_round({recipes, elves}) do
    recipes = next_recipes(recipes, elves)
    {recipes, choose_next_recipe(recipes, elves)}
  end
end

# Day14.part1(147061) |> IO.inspect
Day14.part2(147061) |> IO.inspect
