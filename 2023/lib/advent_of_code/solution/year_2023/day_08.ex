defmodule AdventOfCode.Solution.Year2023.Day08 do
  def part1(input) do
    {dirs, network} = parse_input(input)
    dirs
    |> Stream.cycle
    |> Stream.with_index(0)
    |> Enum.reduce_while("AAA", fn {dir, step}, curr ->
      if curr == "ZZZ" do
        {:halt, step}
      else
        {:cont, elem(network[curr], dir)}
      end
    end)
  end

  def part2(input) do
    {dirs, network} = parse_input(input)
    starting_nodes = network |> Map.keys |> Enum.filter(&String.ends_with?(&1, "A"))
    # ending_nodes = network |> Map.keys |> Enum.filter(&String.ends_with?(&1, "Z"))
    #
    # length(dirs)

    starting_nodes
    |> Enum.reduce([], fn node, acc -> 
      steps = dirs
      |> Stream.cycle
      |> Stream.with_index(0)
      |> Enum.reduce_while(node, fn {dir, step}, curr ->
        if String.ends_with?(curr, "Z") do
          {:halt, step}
        else
          {:cont, elem(network[curr], dir)}
        end
      end)

      [steps | acc]
    end)
    |> Enum.reduce(&Math.lcm/2)
  end

  def parse_input(input) do
    [directions, network] = String.split(input, "\n\n", trim: true)
    dirs = String.graphemes(directions) 
    |> Enum.map(fn dir -> if dir == "L", do: 0, else: 1 end) 

    network_map = map_network(network)
    {dirs, network_map}
  end

  def map_network(network_string) do
    network_string
    |> String.split("\n", trim: true)
    |> Enum.map(fn str ->
      [[start], [left], [right]] = Regex.scan(~r/\w{3}/, str)
      {start, {left, right}}
    end)
    |> Map.new
  end
end
