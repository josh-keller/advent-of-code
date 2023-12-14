defmodule AdventOfCode.Solution.Year2023.Day12 do
  def part1(input) do
    input
      |> String.split("\n", trim: true)
      |> Enum.map(&process_line/1)
      |> Enum.map(&solve(&1, %{}))
      |> Enum.sum
  end

  def part2(_input) do
  end

  def process_line(line) do
    [records, groups] = String.split(line, " ", trim: true)

    group_nums =
      groups
      |> String.split(",", trim: true)
      |> Enum.map(&String.to_integer/1)

    {records, group_nums}
  end

  def solve(_, memo \\ %{})
  def solve({record, []}, _) do
    if String.contains?(record, "#"), do: 0, else: 1
  end

  def solve({"", _}, _), do: 0
  def solve({record, groups}, memo) do
    [group | rest_of_groups] = groups
    case record do
      <<candidate::binary-size(group)>> ->
        result = if String.contains?(candidate, ".") || length(rest_of_groups) != 0 do
          0
        else
          1
        end
        Map.put(memo, {record, groups}, result)
        result

      <<?., rest_of_record::binary>> ->
        result = solve({rest_of_record, groups}, memo)
        Map.put(memo, {record, groups}, result)
        result
        
      <<_::binary-size(group), ?#, _::binary>> ->
        skip_result = solve({String.slice(record, 1..-1), groups}, memo)
        Map.put(memo, {record, groups}, skip_result)
        skip_result

      <<candidate::binary-size(group), _, rest_of_record::binary>> ->
        skip_result = solve({String.slice(record, 1..-1), groups}, memo)
        rest_result = solve({rest_of_record, rest_of_groups}, memo)
        cond do
          String.contains?(candidate, ".") ->
            Map.put(memo, {record, groups}, skip_result)
            skip_result

          String.starts_with?(candidate, "#") ->
            Map.put(memo, {record, groups}, rest_result)
            rest_result
          
          true ->
            result = skip_result + rest_result
            Map.put(memo, {record, groups}, result)
            result
        end

      _ ->
        Map.put(memo, {record, groups}, 0)
        0
    end
  end
end
