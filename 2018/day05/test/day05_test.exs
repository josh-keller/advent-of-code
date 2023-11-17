defmodule Day05Test do
  use ExUnit.Case
  doctest Day05

  test "same type" do
    assert Day05.same_type?(?a, ?a) == true
    assert Day05.same_type?(?a, ?A) == true
    assert Day05.same_type?(?A, ?a) == true
    assert Day05.same_type?(?A, ?A) == true
    assert Day05.same_type?(?A, ?b) == false
    assert Day05.same_type?(?A, ?B) == false
    assert Day05.same_type?(?a, ?b) == false
  end

  test "same polarity" do
    assert Day05.same_polarity?(?a, ?a) == true
    assert Day05.same_polarity?(?A, ?A) == true
    assert Day05.same_polarity?(?a, ?A) == false
    assert Day05.same_polarity?(?A, ?a) == false
    assert Day05.same_polarity?(?A, ?B) == true
    assert Day05.same_polarity?(?a, ?b) == true
  end

  test "will react" do
    assert Day05.will_react?(?a, ?a) == false
    assert Day05.will_react?(?A, ?A) == false
    assert Day05.will_react?(?a, ?A) == true
    assert Day05.will_react?(?A, ?a) == true
    assert Day05.will_react?(?A, ?B) == false
    assert Day05.will_react?(?a, ?b) == false
  end

  test "react" do
    assert Day05.react("aA") == ""
    assert Day05.react("abBA") == ""
    assert Day05.react("aabAAB") == "aabAAB"
    assert Day05.react("dabAcCaCBAcCcaDA") == "dabCBAcaDA"
  end

  test "letters removed" do
    assert Day05.letters_removed("abcABC") == ["bcBC", "acAC", "abAB"]
  end

  test "remove letter" do
    assert Day05.remove_letter("abcABC", "a") == "bcBC"
    assert Day05.remove_letter("abcABC", "B") == "acAC"
  end

  test "part2" do
    assert Day05.part2(["dabAcCaCBAcCcaDA"]) == 4
  end
end
