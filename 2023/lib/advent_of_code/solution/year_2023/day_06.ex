defmodule AdventOfCode.Solution.Year2023.Day06 do
  def part1(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn line -> line |> String.split |> Enum.drop(1) |> Enum.map(&String.to_integer/1) end)
    |> solve
  end

  def part2(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn line -> line |> String.replace(~r/[^\d]/, "") |> String.to_integer |> List.wrap end)
    |> solve
  end

  def solve(parsed_input) do
    parsed_input
    |> Enum.zip
    |> Enum.map(fn {time, dist} -> solve_quadratic(-1, time, -dist) end)
    |> Enum.map(fn {t1, t2} -> next_int_down(t2) - next_int_up(t1) + 1 end)
    |> Enum.reduce(1, &Kernel.*/2)
  end

  def solve_quadratic(a, b, c) do
    discriminant = :math.sqrt((b*b) - (4 * a * c))
    {(-b + discriminant) / 2 * a, (-b - discriminant) / 2 * a }
  end

  def next_int_up(n) when trunc(n) == n, do: n + 1
  def next_int_up(n) when trunc(n) != n, do: ceil(n)

  def next_int_down(n) when trunc(n) == n, do: n - 1
  def next_int_down(n) when trunc(n) != n, do: floor(n)
end
