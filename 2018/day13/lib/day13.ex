defmodule Day13 do
  @moduledoc """

  PROBLEM:

  GOAL: Location of the first crash

  DATA STRUCTURES:
  - Track: static structure with just the tracks on it. Map of points and -, |, /, \, +
    %{
      {x,y} => track type
    }
  - Carts:
    %{
      {x,y} => cart
    }
  - Cart:
    %{
      direction (up, down, left, right)
      next turn (left, right, straight) 
    }
  """

  @doc """
  """
  def part1 do
    nil
  end

  def part2() do
    File.read!("input.txt")
    |> String.trim_trailing()
    |> parse_input()
    |> last_remaining_cart()
    |> IO.inspect()
  end

  def parse_input(input) do
    input
    |> String.trim_trailing()
    |> String.split("\n")
    |> Enum.with_index()
    |> Enum.reduce({%{}, %{}}, fn {line, y}, {track, carts} ->
      line
      |> String.codepoints()
      |> Enum.with_index()
      |> Enum.reduce({track, carts}, fn {codepoint, x}, {track, carts} ->
        case codepoint do
          " " ->
            {track, carts}

          c when c in ["-", "|", "\\", "/", "+"] ->
            {Map.put(track, {x, y}, c), carts}

          c when c in ["<", ">"] ->
            {
              Map.put(track, {x, y}, "-"),
              Map.put(carts, {x, y}, %{dir: c, next_turn: :left})
            }

          c when c in ["^", "v"] ->
            {
              Map.put(track, {x, y}, "|"),
              Map.put(carts, {x, y}, %{dir: c, next_turn: :left})
            }
        end
      end)
    end)
  end

  def next_loc({x, y}, %{dir: d}) do
    case d do
      ">" ->
        {x + 1, y}

      "<" ->
        {x - 1, y}

      "^" ->
        {x, y - 1}

      "v" ->
        {x, y + 1}
    end
  end

  def next_cart(cart, new_loc, track) do
    case Map.fetch!(track, new_loc) do
      "+" ->
        handleIntersection(cart)

      "\\" ->
        handleCorner(cart, "\\")

      "/" ->
        handleCorner(cart, "/")

      "|" ->
        cart

      "-" ->
        cart

      _ ->
        raise "Bad track character"
    end
  end

  def handleCorner(%{dir: ">", next_turn: nt}, "\\"), do: %{dir: "v", next_turn: nt}
  def handleCorner(%{dir: "<", next_turn: nt}, "\\"), do: %{dir: "^", next_turn: nt}
  def handleCorner(%{dir: "^", next_turn: nt}, "\\"), do: %{dir: "<", next_turn: nt}
  def handleCorner(%{dir: "v", next_turn: nt}, "\\"), do: %{dir: ">", next_turn: nt}
  def handleCorner(%{dir: ">", next_turn: nt}, "/"), do: %{dir: "^", next_turn: nt}
  def handleCorner(%{dir: "<", next_turn: nt}, "/"), do: %{dir: "v", next_turn: nt}
  def handleCorner(%{dir: "^", next_turn: nt}, "/"), do: %{dir: ">", next_turn: nt}
  def handleCorner(%{dir: "v", next_turn: nt}, "/"), do: %{dir: "<", next_turn: nt}

  def handleIntersection(%{dir: dir, next_turn: :left}) do
    case dir do
      "<" ->
        %{dir: "v", next_turn: :straight}

      "v" ->
        %{dir: ">", next_turn: :straight}

      ">" ->
        %{dir: "^", next_turn: :straight}

      "^" ->
        %{dir: "<", next_turn: :straight}
    end
  end

  def handleIntersection(%{dir: dir, next_turn: :right}) do
    case dir do
      "<" ->
        %{dir: "^", next_turn: :left}

      "v" ->
        %{dir: "<", next_turn: :left}

      ">" ->
        %{dir: "v", next_turn: :left}

      "^" ->
        %{dir: ">", next_turn: :left}
    end
  end

  def handleIntersection(%{dir: dir, next_turn: :straight}) do
    %{dir: dir, next_turn: :right}
  end

  def findFirstCollision({track, carts}) do
    Stream.iterate(carts, fn c -> nextTick(track, c) end)
    |> Enum.reduce_while(nil, fn next_tick_result, _ ->
      case next_tick_result do
        {:collision, location} ->
          {:halt, location}

        _ ->
          {:cont, nil}
      end
    end)
  end

  def last_remaining_cart({track, carts}) do
    Stream.iterate(carts, fn c -> nextTickRem(track, c) end)
    |> Enum.reduce_while(nil, fn next_tick_result, _ ->
      # IO.puts("----------")
      # print_track(track, next_tick_result) |> IO.puts
      if Enum.count(next_tick_result) == 1 do
        {:halt, Map.keys(next_tick_result) |> List.first()}
      else
        {:cont, nil}
      end
    end)
  end

  def print_track(track, carts) do
    {{max_x, _}, _} = Enum.max_by(track, fn {{x, _}, _} -> x end)
    {{_, max_y}, _} = Enum.max_by(track, fn {{_, y}, _} -> y end)

    max_y..0
    |> Enum.reduce([], fn y, lines ->
      new_line =
        max_x..0
        |> Enum.reduce([], fn x, line ->
          cart = Map.get(carts, {x, y})
          tr = Map.get(track, {x, y}, " ")
          char = if cart != nil, do: cart.dir, else: tr
          [char | line]
        end)
        |> Enum.join("")

      [new_line | lines]
    end)
    |> Enum.join("\n")
  end

  def nextTickRem(track, carts) do
    carts
    |> Enum.reduce(carts, fn {loc, cart}, acc ->
      new_acc = Map.delete(acc, loc)
      next_loc = next_loc(loc, cart)

      if Map.has_key?(new_acc, next_loc) do
        Map.delete(new_acc, next_loc)
      else
        Map.put(new_acc, next_loc, next_cart(cart, next_loc, track))
      end
    end)
  end

  def nextTick(track, carts) do
    carts
    |> Enum.reduce_while(%{}, fn {loc, cart}, acc ->
      new_acc = Map.delete(acc, loc)
      next_loc = next_loc(loc, cart)

      if Map.has_key?(new_acc, next_loc) do
        {:halt, {:collision, next_loc}}
      else
        {:cont, Map.put(new_acc, next_loc, next_cart(cart, next_loc, track))}
      end
    end)
  end

end

# File.read!("input.txt")
# |> String.trim_trailing()
# |> Day13.parse_input()
# |> Day13.findFirstCollision()
# |> IO.inspect()

Day13.part2()

# Incorrect:
# 41,55
