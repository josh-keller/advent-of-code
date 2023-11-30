defmodule Day08 do
  @moduledoc """
  header - two numbers:
    - quantity of child nodes
    - quantity of metadata entries
  child nodes
  metadata entries

  """

  @doc """
  
  ## Examples

      iex> Day08.part1("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2")
      138

  """
  def part1(input) do
    input
    |> parse
    |> parseNode
    |> elem(1)
  end

  @doc """
  
  ## Examples

      iex> Day08.part2("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2")
      66
  """

  def part2(input) do
    input
    |> parse
    |> parseNode2
    |> elem(1)
  end

  def parse(input) do
    input
    |> String.split
    |> Enum.map(&String.to_integer/1)
  end

  def parseNode([childCount, metaCount | rest ]) do
    { childConsumed, childSum } = parseChildren(rest, childCount, { 0, 0 })
    rest = Enum.take(rest, childConsumed - length(rest))
    { 2 + childConsumed + metaCount, childSum + Enum.sum(Enum.take(rest, metaCount)) }
  end

  def parseChildren(_, 0, acc), do: acc
  def parseChildren(children, count, { consumed, sum }) do
    { childConsumed, childSum } = parseNode(children)
    parseChildren(Enum.take(children, childConsumed - length(children)), count - 1, { consumed + childConsumed, sum + childSum })
  end

  # def parseNode2([]), do: { 0, 0 }
  def parseNode2([0, metaCount | rest]) do
    sum = rest
    |> Enum.take(metaCount)
    |> Enum.sum
    
    { 2 + metaCount, sum }
  end
  def parseNode2([childCount, metaCount | rest]) do
    { childConsumed, childSums } = parseChildren2(rest, childCount, { 0, [] })

    indexes = rest
    |> Enum.take(childConsumed - length(rest))
    |> Enum.take(metaCount)

    nodeValue = indexes |> Enum.reduce(0, fn idx, sum -> 
      if idx == 0 do
        sum
      else
        sum + Enum.at(childSums, idx - 1, 0)
      end
    end)

    { 2 + childConsumed + metaCount, nodeValue }
  end

  def parseChildren2(_, 0, acc), do: acc
  def parseChildren2(children, count, { consumed, values }) do
    { childConsumed, childValue } = parseNode2(children)
    parseChildren2(
      Enum.take(children, childConsumed - length(children)),
      count - 1,
      { consumed + childConsumed, values ++ [childValue] }
    )
  end
end

# File.read!("input.txt") |> String.trim |> Day08.part1() |> IO.inspect
File.read!("input.txt") |> String.trim |> Day08.part2() |> IO.inspect
# File.read!("test.txt") |> String.trim |> Day08.part2()
