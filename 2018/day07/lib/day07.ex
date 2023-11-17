defmodule Day07 do
  @moduledoc """
  Documentation for `Day07`.
  """

  @doc """
  """
  def parse(lines) do
    lines
    |> Enum.map(fn line -> 
      line
      |> String.split
        |> Enum.drop(1) 
        |> Enum.take_every(6)
        |> List.to_tuple
    end)
  end

  def before(pairs) do
    pairs
    |> Enum.reduce(Map.new(), fn { prereq, step }, steps ->
         steps |> Map.update(step, [prereq], &([prereq] ++ &1)) |> Map.put_new(prereq, [])
    end)
  end

  def combined(parsed) do
    parsed
    |> before
  end

  def part1(input) do
    input
    |> find_route("")
  end

  def find_route(parts, route) when parts == %{}, do: route
  def find_route(parts, route) do
    next = next_part(parts)
    find_route(do_step(parts, next), route <> next)
  end

  def do_step(parts, step) do
    parts
    |> Map.delete(step) 
    |> Enum.map(fn {k, prereqs} -> 
      {k, Enum.filter(prereqs, &(&1 != step))}
    end)
    |> Map.new()
  end

  def next_part([]), do: ""
  def next_part(parts) do
    parts
    |> Map.filter(fn {_, v} -> length(v) == 0 end)
    |> Map.keys
    |> Enum.sort
    |> List.first
  end


  def run(input, part) do
    case part do
      1 ->
        input |> parse |> combined |> part1

      # 2 ->
      #   input |> parse |> combined |> part2
    end
  end

end

File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day07.run(1) |> IO.inspect
