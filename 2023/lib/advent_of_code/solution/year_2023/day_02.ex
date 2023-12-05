defmodule AdventOfCode.Solution.Year2023.Day02 do
  def part1(input) do
    input
    # %{ id => [%{red: r, green: g, blue: b}, ...]}
    |> parse_input
    |> Enum.filter(&possible_game?(elem(&1, 1), %{red: 12, green: 13, blue: 14}))
    |> Enum.reduce(0, fn {id, _}, sum -> id + sum end)
  end

  def part2(input) do
    input
    |> parse_input
    |> Enum.map(&fewest_cubes(elem(&1, 1), %{red: 0, green: 0, blue: 0}))
    |> Enum.map(&cube_power(&1))
    |> Enum.sum()
  end

  def cube_power(%{red: r, green: g, blue: b}), do: r * g * b

  def fewest_cubes([], acc), do: acc

  def fewest_cubes([head | rest], %{red: acc_red, green: acc_green, blue: acc_blue}) do
    fewest_cubes(rest, %{
      red: max(acc_red, Map.get(head, :red, 0)),
      blue: max(acc_blue, Map.get(head, :blue, 0)),
      green: max(acc_green, Map.get(head, :green, 0))
    })
  end

  def possible_game?([], _), do: true

  def possible_game?([cube | rest], params) do
    params[:red] >= Map.get(cube, :red, 0) and
      params[:blue] >= Map.get(cube, :blue, 0) and
      params[:green] >= Map.get(cube, :green, 0) and
      possible_game?(rest, params)
  end

  def parse_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(&extract_line_parts(&1))
    |> Map.new()
  end

  def extract_line_parts(line) do
    [game_str, cubes_str] = String.split(line, ": ", trim: true)

    game =
      String.replace(game_str, "Game ", "")
      |> String.to_integer()

    cubes =
      String.split(cubes_str, "; ", trim: true)
      |> Enum.map(&parse_cubes(&1))

    {game, cubes}
  end

  def parse_cubes(str) do
    str
    |> String.split(", ", trim: true)
    |> Enum.map(&parse_cube(&1))
    |> Map.new()
  end

  def parse_cube(cube_str) do
    cube_str
    |> String.split(" ", trim: true)
    |> Enum.reverse()
    |> List.to_tuple()
    |> (fn {color, count} -> {String.to_atom(color), String.to_integer(count)} end).()
  end
end
