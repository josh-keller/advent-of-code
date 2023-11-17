defmodule Day02Test do
  use ExUnit.Case
  doctest Day02

  @input [
    # contains no letters that appear exactly two or three times.
    "abcdef",
    # contains two a and three b, so it counts for both.
    "bababc",
    # contains two b, but no letter appears exactly three times.
    "abbcde",
    # contains three c, but no letter appears exactly two times.
    "abcccd",
    # contains two a and two d, but it only counts once.
    "aabcdd",
    # contains two e.
    "abcdee",
    "ababab"
  ]

  @twice [0, 1, 1, 0, 2, 1, 0]
  @thrice [0, 1, 0, 1, 0, 0, 2]

  test "count letters" do
    counts =
      @input
      |> Enum.map(&Day02.count_letters/1)

    assert counts == [
      %{"a" => 1, "b" => 1, "c" => 1, "d" => 1, "e" => 1, "f" => 1},
      %{"a" => 2, "b" => 3, "c" => 1},
      %{"a" => 1, "b" => 2, "c" => 1, "d" => 1, "e" => 1},
      %{"a" => 1, "b" => 1, "c" => 3, "d" => 1},
      %{"a" => 2, "b" => 1, "c" => 1, "d" => 2},
      %{"a" => 1, "b" => 1, "c" => 1, "d" => 1, "e" => 2},
      %{"a" => 3, "b" => 3}
      ]
  end

  # contains three a and three b, but it only counts once.
  test "exactly two" do
    assert Day02.exactly(@input, 2) == @twice
  end

  test "exactly three" do
    assert Day02.exactly(@input, 3) == @thrice
  end

  test "remove at" do
    assert Day02.remove_at("abcd", 0) == "bcd"
    assert Day02.remove_at("abcd", 1) == "acd"
    assert Day02.remove_at("abcd", 2) == "abd"
    assert Day02.remove_at("abcd", 3) == "abc"
  end

  test "all substrings" do
    assert Day02.all_substrings("abcd") == ["bcd", "acd", "abd", "abc"]
  end
end

