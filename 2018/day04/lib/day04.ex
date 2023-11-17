defmodule Day04 do
  @moduledoc """
  Documentation for `Day04`.
  """

  @doc """

  ## Examples

  """
  def prepInput(input) do
    re = ~r/\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})\] (.+)/
    input
    |> Enum.map(&Regex.run(re, &1, capture: :all_but_first))
    |> Enum.map(&parseParts/1)
    |> Enum.sort_by(&(&1.timestamp), &(DateTime.before?(&1, &2)))
    |> Enum.reduce(%{guard: nil, state: nil, since: nil, schedule: %{}}, fn %{event: event, timestamp: ts}, acc ->
      case event do
        {:start_shift, [new_guard]} ->
          new_schedule =
            if acc.state == :sleep do
              Map.update(acc.schedule, acc.guard, [acc.since..minsAfterMidnight(ts)-1], fn curr -> [acc.since..minsAfterMidnight(ts) - 1 | curr ] end)
            else
              acc.schedule
            end

          %{guard: new_guard, state: :wake, since: minsAfterMidnight(ts), schedule: new_schedule}
        :wake ->
          new_schedule = Map.update(acc.schedule, acc.guard, [acc.since..minsAfterMidnight(ts)-1], fn curr -> [acc.since..minsAfterMidnight(ts)-1 | curr ] end)
          %{guard: acc.guard, state: :wake, since: minsAfterMidnight(ts), schedule: new_schedule}
        :sleep ->
          %{guard: acc.guard, state: :sleep, since: minsAfterMidnight(ts), schedule: acc.schedule}
      end
    end)
    |> Map.get(:schedule)
    |> Enum.map(fn {id, mins} -> 
      { id, 
        mins |> Enum.flat_map(fn r -> r |> Enum.into([]) end) |> Enum.frequencies()
      }
    end)
  end
  def part1(input) do
    input
    |> prepInput
    |> Enum.map(fn {id, counts} ->
      {
        id,
        counts |> Enum.reduce(0, fn {_, count}, sum -> sum + count end),
        counts |> Enum.max_by(fn {_, count} -> count end)
      }
    end)
    |> Enum.max_by(fn {_, total, _} ->
      total
    end)
    |> idByMinute
  end

  def part2(input) do
    input
    |> prepInput
    |> Enum.reduce(%{id: nil, maxCount: 0, maxMin: nil}, fn {id, counts}, acc ->
      {candidateMin, candidateCount} = counts |> Enum.max_by(&(elem(&1, 1)))
      cond do
        candidateCount > acc.maxCount ->
          %{id: id, maxCount: candidateCount, maxMin: candidateMin}
        true ->
          acc
      end
    end)
    |> idByMinute
  end

  def idByMinute({id, _, {min, _}}), do: String.to_integer(id) * min
  def idByMinute(%{id: id, maxCount: _, maxMin: min}), do: String.to_integer(id) * min

  def minsAfterMidnight(ts) do
    ts
    |> DateTime.to_time()
    |> Time.to_seconds_after_midnight()
    |> elem(0)
    |> div(60)
  end

  def parseParts([rawDate, rawTime, rawEvent]) do
    %{
      timestamp: parseTimestamp(rawDate, rawTime),
      event: parseEvent(rawEvent)
    }
  end

  def parseTimestamp(rawDate, rawTime) do
    {:ok, datetime, 0} = DateTime.from_iso8601(rawDate <> "T" <> rawTime <> ":00Z")
    datetime
  end

  def parseEvent("wakes up"), do: :wake
  def parseEvent("falls asleep"), do: :sleep
  def parseEvent(str) do
    guard = Regex.run(~r/Guard #(\d+) begins shift/, str, capture: :all_but_first)
    {:start_shift, guard}
  end
end

# File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day04.part1() |> IO.inspect
File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day04.part2() |> IO.inspect

# Part 2: 27995 is too low
