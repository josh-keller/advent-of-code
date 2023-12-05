defmodule AdventOfCode.Solution.Year2023.Day03 do
  def part1(input) do
    symbols = parse_symbols(input)
    find_numbers(input)
    |> Enum.filter(&adjacent_to_symbol?(&1, symbols))
    |> Enum.map(&Map.get(&1, :val))
    |> Enum.sum
  end

  def part2(input) do
    numbers = find_numbers(input)
    input
    |> parse_symbols
    |> Enum.filter(fn {_, val} -> val == "*" end)
    |> Enum.reduce(%{}, fn {{c, r}, _val}, acc -> Map.put(acc, {c,r}, adjacent_numbers({c,r}, numbers)) end)
    |> Enum.filter(fn {_, nums} -> length(nums) == 2 end)
    |> Enum.map(fn {_, nums} -> Enum.reduce(nums, &Kernel.*/2) end)
    |> Enum.sum
  end

  def adjacent_numbers({gear_c, gear_r}, numbers) do
    numbers
    |> Enum.filter(fn %{val: _, row: r, col_start: c1, col_end: c2} -> 
      gear_r <= r + 1 and 
        gear_r >= r - 1 and
        gear_c in c1 - 1..c2 + 1
    end)
    |> Enum.map(&Map.get(&1, :val))
  end

  def parse_symbols(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.with_index
    |> Enum.reduce(%{}, fn {line, row}, grid -> 
      line
      |> String.graphemes
      |> Enum.with_index
      |> Enum.reduce(grid, fn {char, col}, grid -> 
        case char do
          x when x in ~w(0 1 2 3 4 5 6 7 8 9 .) ->
            grid
          _ ->
            Map.put(grid, {col, row}, char)
        end
      end)
    end)
  end

  def adjacent_to_symbol?(%{val: _, row: row, col_start: col_start, col_end: col_end}, symbols) do
    row-1..row+1
    |> Enum.any?(fn r -> 
      col_start-1..col_end+1
      |> Enum.any?(fn c ->
        Map.get(symbols, {c, r})
      end)
    end)
  end
  
  def find_numbers(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.with_index
    |> Enum.reduce([], fn {line, row}, acc -> 
      nums = Regex.scan(~r/\d+/, line, return: :index)
      |> Enum.map(fn [{col, len}] -> 
        %{
          val: String.slice(line, col, len) |> String.to_integer,
          row: row,
          col_start: col,
          col_end: col + len - 1,
        }
      end)

      nums ++ acc
    end)
  end
end
