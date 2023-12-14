defmodule AdventOfCode.Solution.Year2023.Day10Test do
  use ExUnit.Case, async: true

  import AdventOfCode.Solution.Year2023.Day10

  setup do
    [
      input: """
      .....
      .S-7.
      .|.|.
      .L-J.
      .....
      """,
      input2_1: """
      ...........
      .S-------7.
      .|F-----7|.
      .||.....||.
      .||.....||.
      .|L-7.F-J|.
      .|..|.|..|.
      .L--J.L--J.
      ...........
      """,
      input2_2: """
      .F----7F7F7F7F-7....
      .|F--7||||||||FJ....
      .||.FJ||||||||L7....
      FJL7L7LJLJ||LJ.L-7..
      L--J.L7...LJS7F-7L7.
      ....F-J..F7FJ|L7L7L7
      ....L7.F7||L7|.L7L7|
      .....|FJLJ|FJ|F7|.LJ
      ....FJL-7.||.||||...
      ....L---J.LJ.LJLJ...
      """,
      input2_3: """
      FF7FSF7F7F7F7F7F---7
      L|LJ||||||||||||F--J
      FL-7LJLJ||||||LJL-77
      F--JF--7||LJLJ7F7FJ-
      L---JF-JLJ.||-FJLJJ7
      |F|F-JF---7F7-L7L|7|
      |FFJF7L7F-JF7|JL---7
      7-L-JL7||F7|L7F-7F7|
      L.L7LFJ|||||FJL7||LJ
      L7JLJL-JLJLJL--JLJ.L
      """,
      input2_4: """
      ················
      ···F7·····F7····
      ···||·····||····
      ···|L--S--J|····
      ·F-J.F---7.L-7··
      ·L--7|···|F--J··
      ····||···||·····
      ····LJ···LJ·····
      ················
      """,
      input2_5: """
      S-7F7·
      L7LJ|·
      FJ.FJ·
      |F7L7·
      LJL-J·
      """,
      input2_6: """
      S-7F7
      L7LJ|
      FJ.FJ
      |F7L7
      LJL-J
      """,
      input2_7: """
      ...............
      ...F7.....F7...
      ...||.....||...
      ...|L--S--J|...
      .F-J.F---7.L-7.
      .L--7|...|F--J.
      ....||...||....
      ....LJ...LJ....
      ...............
      """
    ]
  end

  @tag :skip
  test "part1", %{input: input} do
    result = part1(input)

    assert result == 4
  end

  @tag :skip
  test "part2_1", %{input2_1: input1, input2_2: input2, input2_3: input3, input2_4: input4, input2_5: input5, input2_6: input6} do
    result = part2(input1)
    assert result == 4
    result = part2(input2)
    assert result == 8
    result = part2(input3)
    assert result == 10
    result = part2(input4)
    assert result == 2 
    result = part2(input5)
    assert result == 1
  end

  test "part2_a", %{input2_6: input6, input2_7: input7} do
    result = part2(input6)
    assert result == 1
    result = part2(input7)
    assert result == 2
  end
end
