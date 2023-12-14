defmodule AdventOfCode.Solution.Year2023.Day07 do
  def part1(input) do
    input
    |> parse_input
    |> Enum.sort(&compare_hands/2)
    |> Enum.with_index(1)
    |> Enum.map(fn {%{bid: bid}, idx} -> bid * idx end)
    |> Enum.sum()
  end

  def part2(input) do
    input
    |> parse_input
    |> Enum.sort(&compare_hands_2/2)
    |> Enum.with_index(1)
    |> Enum.map(fn {%{bid: bid}, idx} -> bid * idx end)
    |> Enum.sum()
  end

  def parse_input(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(fn line -> line |> String.split(" ") end)
    |> Enum.map(fn [hand, bid] ->
      %{
        hand: hand,
        bid: String.to_integer(bid),
        counts: hand |> String.graphemes() |> Enum.frequencies()
      }
    end)
  end

  def compare_hands(hand1, hand2) do
    type1 = type_hand(hand1)
    type2 = type_hand(hand2)

    if type1 == type2 do
      compare_same_ranks(hand1.hand, hand2.hand)
    else
      type1 < type2
    end
  end

  def compare_hands_2(hand1, hand2) do
    type1 = type_hand_2(hand1)
    type2 = type_hand_2(hand2)

    if type1 == type2 do
      compare_same_ranks_2(hand1.hand, hand2.hand)
    else
      type1 < type2
    end
  end

  def compare_same_ranks(hand1, hand2) do
    [String.graphemes(hand1), String.graphemes(hand2)]
    |> Enum.zip()
    |> Enum.reduce_while(nil, fn {c1, c2}, _ ->
      if c1 == c2, do: {:cont, nil}, else: {:halt, compare_cards(c1, c2)}
    end)
  end

  def compare_same_ranks_2(hand1, hand2) do
    [String.graphemes(hand1), String.graphemes(hand2)]
    |> Enum.zip()
    |> Enum.reduce_while(nil, fn {c1, c2}, _ ->
      if c1 == c2, do: {:cont, nil}, else: {:halt, compare_cards_2(c1, c2)}
    end)
  end

  def compare_cards(c1, c2) do
    cond do
      c2 == "A" -> true
      c1 == "A" -> false
      c2 == "K" -> true
      c1 == "K" -> false
      c2 == "Q" -> true
      c1 == "Q" -> false
      c2 == "J" -> true
      c1 == "J" -> false
      c2 == "T" -> true
      c1 == "T" -> false
      true -> c1 < c2
    end
  end

  def compare_cards_2(c1, c2) do
    cond do
      c1 == "J" -> true
      c2 == "J" -> false
      c2 == "A" -> true
      c1 == "A" -> false
      c2 == "K" -> true
      c1 == "K" -> false
      c2 == "Q" -> true
      c1 == "Q" -> false
      c2 == "T" -> true
      c1 == "T" -> false
      true -> c1 < c2
    end
  end

  def type_hand(hand) do
    cond do
      Enum.any?(hand.counts, fn {_, c} -> c == 5 end) ->
        # :five_of_a_kind
        5

      Enum.any?(hand.counts, fn {_, c} -> c == 4 end) ->
        # :four_of_a_kind
        4

      Enum.any?(hand.counts, fn {_, c} -> c == 3 end) ->
        if Enum.any?(hand.counts, fn {_, c} -> c == 2 end) do
          # :full_house
          3.5
        else
          # :three_of_a_kind
          3
        end

      Enum.any?(hand.counts, fn {_, c} -> c == 2 end) ->
        if Enum.count(hand.counts, fn {_, c} -> c == 2 end) == 2 do
          # :two_pair
          2
        else
          # :one_pair
          1
        end

      true ->
        # :high_card
        0
    end
  end

  def type_hand_2(hand) do
    jokers = Map.get(hand.counts, "J", 0)
    sorted_counts = Enum.sort_by(hand.counts, fn {_, v} -> v end, :desc)
    {max_card, max_count} = List.first(sorted_counts)

    cond do
      jokers == 0 or jokers == 5 ->
        type_hand(hand)

      max_card == "J" ->
        {second_card, second_count} = Enum.at(sorted_counts, 1)
        new_counts = hand.counts |> Map.delete("J") |> Map.put(second_card, second_count + jokers)
        type_hand(%{hand | counts: new_counts})

      true ->
        new_counts = hand.counts |> Map.delete("J") |> Map.put(max_card, max_count + jokers)
        type_hand(%{hand | counts: new_counts})
    end
  end
end
