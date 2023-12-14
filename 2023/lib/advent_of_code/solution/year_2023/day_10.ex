defmodule AdventOfCode.Solution.Year2023.Day10 do
  def part1(input) do
    input
    |> parse_input
    |> traverse_loop
    |> Map.values
    |> Enum.sort(:desc)
    |> List.first
    |> Kernel.div(2)
  end

  def part2(input) do
    grid = input
    |> parse_input
    loop = grid |> traverse_loop

    sorted = loop
    |> Enum.sort_by(fn {_, step} -> step end)

    IO.inspect(Enum.take(sorted, 10))
    IO.inspect(Enum.drop(sorted, length(sorted) - 10))
    IO.inspect(length(sorted))

    count_interior(grid, loop)
  end

  def count_interior(_grid, loop) do
    keys = Map.keys(loop)
    loop_len = length(keys)
    {min_x, max_x} = Enum.map(keys, &elem(&1, 0)) |> Enum.min_max
    {min_y, max_y} = Enum.map(keys, &elem(&1, 1)) |> Enum.min_max
    IO.puts("MINX: #{min_x}, MAXX: #{max_x}")
    IO.puts("MINY: #{min_y}, MAXY: #{max_y}")

    min_y..max_y
    |> Enum.reduce({0, 0}, fn y, {count, _crossing_counter} -> 
      min_x..max_x
      |> Enum.reduce({count, 0}, fn x, {count, crossing_counter} -> 
        current = Map.get(loop, {x,y})
        below = Map.get(loop, {x, y+1})
        
        # IO.puts("#{x},#{y}: #{count}, #{crossing_counter}")

        cond do
          # Current square is not on loop, but the counter is not 0 -> we are inside the loop!
          !current && (crossing_counter != 0) ->
            # IO.puts("incrementing")
            {count + 1, crossing_counter}

          # Current square is not on loop, but counter is 0 -> we are outside the loop
          !current && (crossing_counter == 0) ->
            # IO.puts("outside")
            {count, crossing_counter}

          # Current square is on loop, but the one below is not -> we are still outside the loop
          current && !below ->
            # IO.puts("no square below")
            {count, crossing_counter}

          # Current square is on loop and the one below is too -> we came from/went to the square below
          # Crossing into or out of the loop
          current && below ->
            diff = current - rem(below, loop_len)
            if abs(diff) == 1 do
              # IO.puts("crossing")
              {count, crossing_counter + diff}
            else
              # IO.puts("not crossing")
              {count, crossing_counter}
            end

          true ->
            throw("Problem with logic")
        end
      end)
    end)
    |> elem(0)
  end

  def parse_input(input) do
    input
    |> String.split("\n")
    |> Enum.with_index()
    |> Enum.reduce(%{}, &reduce_line/2)
  end

  def reduce_line({line, y}, grid) do
    line
    |> String.graphemes()
    |> Enum.with_index()
    |> Enum.reduce(grid, fn {char, x}, acc ->
      if char != ".", do: Map.put(acc, {x, y}, char), else: acc
    end)
  end

  def traverse_loop(grid) do
    start = Map.filter(grid, fn {_, val} -> val == "S" end) |> Map.keys() |> List.first()
    traverse_helper(grid, start, start, %{}, 1)
  end

  def traverse_helper(_, curr, start, loop, step) when step != 1 and curr == start, do: loop
  def traverse_helper(grid, curr, start, loop, step) do
    next_step = get_next(grid, curr, loop)
    traverse_helper(grid, next_step, start, Map.put(loop, next_step, step), step+1)
  end

  def get_next(grid, {x,y}, loop) do
    cond do
      try_right(grid, {x,y}, loop) ->
        {x+1, y}

      try_down(grid, {x,y}, loop) ->
        {x, y+1}

      try_left(grid, {x,y}, loop) ->
        {x-1, y}

      try_up(grid, {x,y}, loop) ->
        {x, y-1}
    end
  end

  def try_right(grid, {x, y}, loop) do
    right = {x+1, y}

    Map.has_key?(grid, right)
      and grid[{x,y}] in ["-", "F", "L", "S"]
      and not Map.has_key?(loop, right)
      and grid[right] in ["-", "J", "7", "S"]
  end

  def try_down(grid, {x, y}, loop) do
    down = {x, y+1}
    Map.has_key?(grid, down)
      and grid[{x,y}] in ["|", "7", "F", "S"]
      and not Map.has_key?(loop, down)
      and grid[down] in ["|", "J", "L", "S"]
  end

  def try_left(grid, {x, y}, loop) do
    left = {x-1, y}
    Map.has_key?(grid, left)
      and grid[{x,y}] in ["-", "J", "7", "S"]
      and not Map.has_key?(loop, left)
      and grid[left] in ["-", "F", "L", "S"]
  end

  def try_up(grid, {x, y}, loop) do
    up = {x, y-1}
    Map.has_key?(grid, up)
      and grid[{x,y}] in ["|", "J", "L", "S"]
      and not Map.has_key?(loop, up)
      and grid[up] in ["|", "7", "F", "S"]
  end
end
