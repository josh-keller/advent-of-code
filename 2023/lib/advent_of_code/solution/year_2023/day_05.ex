defmodule AdventOfCode.Solution.Year2023.Day05 do
  # Goal: lowest location number that corresponds to any of the initial seeds
  # Convert each seed number through other categories to find location number

  def part1(input) do
    {seeds, maps} = parse_input(input)

    seeds
    |> Enum.map(&get_location(&1, maps))
    |> Enum.map(&elem(&1, 1))
    |> Enum.min()
  end

  def part2(input) do
    {seeds, maps} = parse_input(input)

    seeds
    |> Enum.chunk_every(2)
    |> Enum.map(fn [f, l] -> f..(f + l - 1) end)
    |> get_location_ranges(maps)
    |> Enum.sort()
    |> List.first()
    |> (fn range -> range.first end).()
  end

  defp get_location_ranges(seed_range, maps) do
    Stream.iterate({"seed", seed_range}, &get_next_resource_ranges(&1, maps))
    |> Enum.take_while(fn {resource, _} -> resource != "done" end)
    |> List.last()
    |> elem(1)
  end

  defp get_next_resource_ranges({"location", _}, _), do: {"done", nil}

  defp get_next_resource_ranges({resource, range}, maps) do
    next_resource = maps[resource].dest
    dest_ranges = get_dest_resource_ranges(List.wrap(range), maps[resource].mappings, [])
    {next_resource, dest_ranges}
  end

  defp get_dest_resource_ranges([], _, mapped), do: mapped

  defp get_dest_resource_ranges([to_map | rest_to_map], mappings, mapped) do
    # Find a mapping that contains the beginning of the range to map
    mapping = Enum.find(mappings, &(to_map.first in &1.range))

    cond do
      # no mapping was found, the whole range is greater than all mappings
      mapping == nil ->
        get_dest_resource_ranges(rest_to_map, mappings, [to_map | mapped])

      # mapping was found and the end of range is within the mapping too
      to_map.last in mapping.range ->
        get_dest_resource_ranges(rest_to_map, mappings, [map_range(to_map, mapping) | mapped])

      # mapping was found and the end of range is NOT within the mapping
      true ->
        range_to_map = to_map.first..mapping.range.last
        leftover_range = (mapping.range.last + 1)..to_map.last

        get_dest_resource_ranges(
          [leftover_range | rest_to_map],
          mappings,
          [map_range(range_to_map, mapping) | mapped]
        )
    end
  end

  defp map_range(range, mapping) do
    (range.first + mapping.offset)..(range.last + mapping.offset)
  end

  defp get_location(seed_num, maps) do
    Stream.iterate({"seed", seed_num}, &get_next_resource(&1, maps))
    |> Enum.take_while(fn {resource, _} -> resource != "done" end)
    |> List.last()
  end

  defp get_next_resource({"location", _}, _), do: {"done", nil}

  defp get_next_resource({resource, number}, maps) do
    next_resource = maps[resource].dest
    dest_number = get_dest_resource_num(number, maps[resource].mappings)
    {next_resource, dest_number}
  end

  defp get_dest_resource_num(number, mappings) do
    mapping = Enum.find(mappings, &(number in &1.range))
    number + mapping.offset
  end

  defp parse_input(input) do
    max =
      Regex.scan(~r/\d+/, input) |> Enum.map(fn [num] -> String.to_integer(num) end) |> Enum.max()

    [seeds_str | rest] = String.split(input, "\n\n", trim: true)

    seeds =
      String.split(seeds_str, " ", trim: true) |> Enum.drop(1) |> Enum.map(&String.to_integer/1)

    maps = Enum.map(rest, &process_map_listing(&1, max)) |> Map.new()

    {seeds, maps}
  end

  defp process_map_listing(map_str, max) do
    [map_title | listings] = String.split(map_str, "\n", trim: true)
    [source, dest] = Regex.run(~r/(.+)-to-(.+) map:/, map_title, capture: :all_but_first)
    mappings = Enum.map(listings, &process_listing(&1)) |> pad_mappings(max)
    {source, %{dest: dest, mappings: mappings}}
  end

  defp pad_mappings(mappings, max) do
    sorted_mappings = mappings |> Enum.sort_by(& &1.range)
    lowest = sorted_mappings |> List.first() |> (fn m -> m.range.first end).()
    highest = sorted_mappings |> List.last() |> (fn m -> m.range.last end).()

    first_mapping =
      if lowest != 0,
        do: [%{dest_range: 0..(lowest - 1), range: 0..(lowest - 1), offset: 0}],
        else: []

    last_mapping =
      if highest != max,
        do: [%{dest_range: (highest + 1)..max, range: (highest + 1)..max, offset: 0}],
        else: []

    first_mapping ++ last_mapping ++ mappings
  end

  defp process_listing(listing) do
    [dest_start, source_start, map_len] =
      String.split(listing, " ", trim: true) |> Enum.map(&String.to_integer/1)

    source_range = source_start..(source_start + map_len - 1)
    offset = dest_start - source_start

    %{
      range: source_range,
      dest_range: (source_range.first + offset)..(source_range.last + offset),
      offset: offset
    }
  end
end
