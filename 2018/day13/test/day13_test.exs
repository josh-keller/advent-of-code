defmodule Day13Test do
  use ExUnit.Case
  import Day13

  doctest Day13

  test "read in track" do
    input = ~S"""
    /->-\        
    |   |  /----\
    | /-+--+-\  |
    | | |  | v  |
    \-+-/  \-+--/
      \------/  
    """
    {track, carts} = parse_input(input)
    assert track == %{
      {0,0} => "/",  {1,0} => "-", {2,0} => "-", {3,0} => "-", {4,0} => "\\",
      {0,1} => "|",  {4,1} => "|", {7,1} => "/", {8,1} => "-", {9,1} => "-", {10,1} => "-", {11,1} => "-", {12,1} => "\\",
      {0,2} => "|",  {2,2} => "/", {3,2} => "-", {4,2} => "+", {5,2} => "-", {6,2} => "-", {7,2} => "+", {8,2} => "-", {9,2} => "\\",  {12,2} => "|",
      {0,3} => "|",  {2,3} => "|", {4,3} => "|", {7,3} => "|", {9,3} => "|", {12,3} => "|",
      {0,4} => "\\", {1,4} => "-", {2,4} => "+", {3,4} => "-", {4,4} => "/", {7,4} => "\\", {8,4} => "-", {9,4} => "+",{10,4} => "-",{11,4} => "-", {12,4} => "/",
      {2,5} => "\\", {3,5} => "-", {4,5} => "-", {5,5} => "-", {6,5} => "-", {7,5} => "-", {8,5} => "-", {9,5} => "/",
    }
    assert carts == %{
      {2,0} => %{ dir: ">", next_turn: :left},
      {9,3} => %{ dir: "v", next_turn: :left}
    }
  end

  test "last remaining cart" do
    input = ~S"""
    />-<\  
    |   |  
    | /<+-\
    | | | v
    \>+</ |
      |   ^
      \<->/  
    """

    last_remaining = parse_input(input) |> last_remaining_cart

    assert last_remaining == {6,4}
  end

  test "find first collision" do
    track = %{
      {0,0} => "/",  {1,0} => "-", {2,0} => "-", {3,0} => "-", {4,0} => "\\",
      {0,1} => "|",  {4,1} => "|", {7,1} => "/", {8,1} => "-", {9,1} => "-", {10,1} => "-", {11,1} => "-", {12,1} => "\\",
      {0,2} => "|",  {2,2} => "/", {3,2} => "-", {4,2} => "+", {5,2} => "-", {6,2} => "-", {7,2} => "+", {8,2} => "-", {9,2} => "\\",  {12,2} => "|",
      {0,3} => "|",  {2,3} => "|", {4,3} => "|", {7,3} => "|", {9,3} => "|", {12,3} => "|",
      {0,4} => "\\", {1,4} => "-", {2,4} => "+", {3,4} => "-", {4,4} => "/", {7,4} => "\\", {8,4} => "-", {9,4} => "+",{10,4} => "-",{11,4} => "-", {12,4} => "/",
      {2,5} => "\\", {3,5} => "-", {4,5} => "-", {5,5} => "-", {6,5} => "-", {7,5} => "-", {8,5} => "-", {9,5} => "/",
    }

    carts = %{
      {2,0} => %{ dir: ">", next_turn: :left},
      {9,3} => %{ dir: "v", next_turn: :left}
    }

    assert findFirstCollision({track, carts}) == {7,3}
  end

  test "next location" do
    assert next_loc({2,0}, %{dir: ">", next_turn: :left}) == {3,0}
    assert next_loc({2,0}, %{dir: "<", next_turn: :left}) == {1,0}
    assert next_loc({9,3}, %{dir: "v", next_turn: :left}) == {9,4}
    assert next_loc({9,3}, %{dir: "^", next_turn: :left}) == {9,2}
  end
  
  test "next cart" do
    assert next_cart(%{dir: ">", next_turn: :left}, {4,0}, %{{4,0} => "\\"}) == %{dir: "v", next_turn: :left}
    assert next_cart(%{dir: "v", next_turn: :left}, {4,0}, %{{4,0} => "\\"}) == %{dir: ">", next_turn: :left}
    assert next_cart(%{dir: "<", next_turn: :left}, {4,0}, %{{4,0} => "\\"}) == %{dir: "^", next_turn: :left}
    assert next_cart(%{dir: "^", next_turn: :left}, {4,0}, %{{4,0} => "\\"}) == %{dir: "<", next_turn: :left}
    assert next_cart(%{dir: ">", next_turn: :left}, {4,0}, %{{4,0} => "/"}) == %{dir: "^", next_turn: :left}
    assert next_cart(%{dir: "v", next_turn: :left}, {4,0}, %{{4,0} => "/"}) == %{dir: "<", next_turn: :left}
    assert next_cart(%{dir: "<", next_turn: :left}, {4,0}, %{{4,0} => "/"}) == %{dir: "v", next_turn: :left}
    assert next_cart(%{dir: "^", next_turn: :left}, {4,0}, %{{4,0} => "/"}) == %{dir: ">", next_turn: :left}
    assert next_cart(%{dir: ">", next_turn: :left}, {4,0}, %{{4,0} => "+"}) == %{dir: "^", next_turn: :straight}
    assert next_cart(%{dir: "v", next_turn: :straight}, {4,0}, %{{4,0} => "+"}) == %{dir: "v", next_turn: :right}
    assert next_cart(%{dir: "<", next_turn: :right}, {4,0}, %{{4,0} => "+"}) == %{dir: "^", next_turn: :left}
  end
end
