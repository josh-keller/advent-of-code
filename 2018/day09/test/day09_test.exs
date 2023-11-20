defmodule Day09Test do
  use ExUnit.Case
  doctest Day09

  test "next marble" do
    assert Day09.next_marble_idx(0, 1) == 1
    assert Day09.next_marble_idx(1, 2) == 1
    assert Day09.next_marble_idx(1, 3) == 3
    assert Day09.next_marble_idx(3, 4) == 1
    assert Day09.next_marble_idx(1, 5) == 3
    assert Day09.next_marble_idx(3, 6) == 5
    assert Day09.next_marble_idx(5, 7) == 7
    assert Day09.next_marble_idx(7, 8) == 1
  end

  # Get the one to the right of current
  # C => {L, R}     --> doesn't change[]
  # Get R (from current)
  # Add New => {R, RR}
  # Update R => {C, New}
  # Update RR => {New, existing}

  test "next state" do
    assert Day09.next_state(%{
      marbles: %{0 => {0,0}},
      curr_marble: 0,
      next_marble: 1,
      num_players: 9,
      scores: %{}}) == 
      %{
        marbles: %{0 => {1,1}, 1 => {0, 0}},
        curr_marble: 1,
        next_marble: 2,
        scores: %{},
        num_players: 9,
      }
    assert Day09.next_state(%{
      marbles: %{0 => {1,1}, 1 => {0, 0}},
      curr_marble: 1,
      next_marble: 2,
        num_players: 9,
      scores: %{}}) == 
      %{
        marbles: %{0 => {1,2}, 2 => {0, 1}, 1 => {2, 0}},
        curr_marble: 2,
        next_marble: 3,
        num_players: 9,
        scores: %{},
      }
    assert Day09.next_state(%{
      marbles: %{0 => {3,2}, 2 => {0, 1}, 1 => {2, 3}, 3 => {1, 0}},
      curr_marble: 3,
      next_marble: 4,
        num_players: 9,
      scores: %{}}) == 
      %{
        marbles: %{0 => {3,4}, 4 => {0, 2}, 2 => {4, 1}, 1 => {2, 3}, 3 => {1, 0}},
        curr_marble: 4,
        next_marble: 5,
        num_players: 9,
        scores: %{},
      }
    assert Day09.next_state(%{
      marbles: %{0 => {3,4}, 4 => {0, 2}, 2 => {4, 2}, 5 => {2, 1}, 1 => {5, 6}, 6 => {1, 3}, 3 => {6, 0}},
      curr_marble: 6,
      next_marble: 7,
      num_players: 9,
      scores: %{}}) == 
      %{
        marbles: %{0 => {7,4}, 4 => {0, 2}, 2 => {4, 2}, 5 => {2, 1}, 1 => {5, 6}, 6 => {1, 3}, 3 => {6, 7}, 7 => {3, 0}},
        curr_marble: 7,
        next_marble: 8,
        num_players: 9,
        scores: %{},
      }
    assert Day09.next_state(%{
      marbles: %{
        0 => {15,16}, 
        16 => {0, 8},
        8 => {16, 17},
        17 => {8, 4},
        4 => {17, 18},
        18 => {4, 9},
        9 => {18, 19},
        19 => {9, 2},
        2 => {19, 20},
        20 => {2, 10},
        10 => {20, 21},
        21 => {10, 5},
        5 => {21, 22},
        22 => {5, 11},
        11 => {22, 1},
        1 => {11, 12},
        12 => {1, 6},
        6 => {12, 13},
        13 => {6, 3},
        3 => {13, 14},
        14 => {3, 7},
        7 => {14, 15},
        15 => {7, 0},
      },
      curr_marble: 22,
      next_marble: 23,
        num_players: 9,
      scores: %{}}) == 
      %{
      marbles: %{
        0 => {15,16}, 
        16 => {0, 8},
        8 => {16, 17},
        17 => {8, 4},
        4 => {17, 18},
        18 => {4, 19},
        19 => {18, 2},
        2 => {19, 20},
        20 => {2, 10},
        10 => {20, 21},
        21 => {10, 5},
        5 => {21, 22},
        22 => {5, 11},
        11 => {22, 1},
        1 => {11, 12},
        12 => {1, 6},
        6 => {12, 13},
        13 => {6, 3},
        3 => {13, 14},
        14 => {3, 7},
        7 => {14, 15},
        15 => {7, 0},
      },
        curr_marble: 19,
        next_marble: 24,
        num_players: 9,
        scores: %{4 => 32},
      }
  end
  test "winning score" do
    assert Day09.winning_score(9,25) == 32
    assert Day09.winning_score(10, 1618) == 8317
    assert Day09.winning_score(13, 7999) == 146373
    assert Day09.winning_score(17, 1104) == 2764
    assert Day09.winning_score(21, 6111) == 54718
    assert Day09.winning_score(30, 5807) == 37305
  end
end
