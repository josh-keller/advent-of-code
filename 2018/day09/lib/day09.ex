defmodule Day09 do
  @moduledoc """
  Documentation for `Day09`.
  """

  @doc """
  """
  def next_marble_idx(0, 1), do: 1
  def next_marble_idx(curr, len) do
    next_raw = curr + 2
    if next_raw == len do
      next_raw
    else
      rem(next_raw, len)
    end
  end

  def next_state(%{marbles: marbles, curr_marble: curr_marble, next_marble: next_marble, scores: scores, num_players: n}) when rem(next_marble, 23) == 0 do
    marble_to_remove = curr_marble
    |> Stream.iterate(fn current -> marbles |> Map.fetch!(current) |> elem(0) end)
    |> Stream.drop(1)
    |> Enum.take(7)
    |> List.last

    { counter_from_removed, clock_from_removed } = Map.fetch!(marbles, marble_to_remove)

    new_marbles = marbles
    |> Map.delete(marble_to_remove)
    |> Map.update!(counter_from_removed, fn {prev, _next} -> { prev, clock_from_removed } end)
    |> Map.update!(clock_from_removed, fn {_prev, next} -> { counter_from_removed, next } end)

    curr_player = rem(next_marble - 1, n)
    score_to_add = marble_to_remove + next_marble
  
    %{
      marbles: new_marbles,
      curr_marble: clock_from_removed,
      next_marble: next_marble + 1,
      scores: Map.update(scores, curr_player, score_to_add, fn curr_score -> curr_score + score_to_add end),
      num_players: n,
    }
  end

  def next_state(%{marbles: marbles, curr_marble: curr_marble, next_marble: next_marble, scores: scores, num_players: n}) do
    {_, clockwise1} = Map.get(marbles, curr_marble)
    {_, clockwise2} = Map.get(marbles, clockwise1)
    next_marbles = marbles
    |> Map.put(next_marble, {clockwise1, clockwise2})
    |> Map.update(clockwise1, :no_existing_key, &({elem(&1, 0), next_marble}))
    |> Map.update(clockwise2, :no_existing_key, &({next_marble, elem(&1, 1)}))
    
    %{
      marbles: next_marbles,
      curr_marble: next_marble,
      next_marble: next_marble + 1,
      scores: scores,
      num_players: n,
    }
  end

  def winning_score(num_players, last_marble) do
    _winning_score(%{marbles: %{0 => {0, 0}}, curr_marble: 0, next_marble: 1, scores: %{}, num_players: num_players}, last_marble)
  end

  def _winning_score(%{next_marble: next_marble, scores: scores}, last_marble) when next_marble > last_marble do
    scores
    |> Enum.map( fn {_, score} -> score end)
    |> Enum.max
  end

  def _winning_score(state, last_marble) do
    next_state(state)
    |> _winning_score(last_marble)
  end
end

Day09.winning_score(411, 71058) |> IO.inspect
Day09.winning_score(411, 7105800) |> IO.inspect
