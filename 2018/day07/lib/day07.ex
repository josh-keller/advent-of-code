defmodule Day07 do
  @moduledoc """
  Documentation for `Day07`.
  """

  @doc """
  """
  def parse(lines) do
    lines
    |> Enum.map(fn line ->
      line
      |> String.split()
      |> Enum.drop(1)
      |> Enum.take_every(6)
      |> List.to_tuple()
    end)
  end

  def before(pairs) do
    pairs
    |> Enum.reduce(Map.new(), fn {prereq, step}, steps ->
      steps |> Map.update(step, [prereq], &([prereq] ++ &1)) |> Map.put_new(prereq, [])
    end)
  end

  def combined(parsed) do
    parsed
    |> before
  end

  def part1(input) do
    input
    |> find_route("")
  end

  def find_route(parts, route) when parts == %{}, do: route

  def find_route(parts, route) do
    next = next_part(parts)
    find_route(do_step(parts, next), route <> next)
  end

  def do_step(parts, step) do
    parts
    |> Map.delete(step)
    |> Enum.map(fn {k, prereqs} ->
      {k, Enum.filter(prereqs, &(&1 != step))}
    end)
    |> Map.new()
  end

  def complete_jobs(queue, jobs) do
    queue
    |> Enum.map(fn {job, prereqs} ->
      {job, Enum.filter(prereqs, &(!Enum.member?(jobs, &1)))}
    end)
    |> Map.new()
  end

  def next_part([]), do: ""

  def next_part(parts) do
    parts
    |> Map.filter(fn {_, v} -> length(v) == 0 end)
    |> Map.keys()
    |> Enum.sort()
    |> List.first()
  end

  def run(input, part) do
    case part do
      1 ->
        input |> parse |> combined |> part1

      2 ->
        input |> parse |> combined |> part2
    end
  end

  def part2(input) do
    %{
      time: 0,
      free_workers: 5,
      busy_workers: %{},
      available_jobs: [],
      job_queue: input,
      job_base_time: 60,
      job_order: ""
    } |> choose_first_jobs
    |>_run_part2
  end

  def choose_first_jobs(state) do
    available_jobs = state.job_queue |> Enum.filter(fn {_, v} -> Enum.empty?(v) end) |> Enum.map(&(elem(&1, 0)))
    %{
      state |
      available_jobs: available_jobs,
      job_queue: state.job_queue |> Map.drop(available_jobs)
    }
  end

  def _run_part2(%{available_jobs: [], job_queue: jq, busy_workers: bw, job_order: job_order}) when jq == %{} and bw == %{} do
    job_order
  end

  def _run_part2(state) do
    IO.inspect(state)
    IO.puts("---")
    state = dispatch(state)
    IO.inspect(state)
    IO.puts("---")
    state = complete_next_job(state)
    IO.inspect(state)
    IO.puts("-----------------------")
    _run_part2(state)
  end

  def dispatch(%{available_jobs: []} = state), do: state
  def dispatch(%{free_workers: 0} = state), do: state

  def dispatch(%{
        time: time,
        free_workers: free_workers,
        busy_workers: busy_workers,
        available_jobs: [next_job | rest_of_available_jobs],
        job_queue: job_queue,
        job_base_time: job_base_time,
        job_order: job_order,
      }) do
    %{finished: finished_time} = assign(next_job, time, job_base_time)

    dispatch(%{
      time: time,
      free_workers: free_workers - 1,
      busy_workers: Map.put(busy_workers, next_job, finished_time),
      available_jobs: rest_of_available_jobs,
      job_queue: job_queue,
      job_base_time: job_base_time,
      job_order: job_order,
    })
  end

  def complete_next_job(%{
        time: _,
        free_workers: free_workers,
        busy_workers: busy_workers,
        available_jobs: available_jobs,
        job_queue: job_queue,
        job_base_time: job_base_time,
        job_order: job_order
      }) do
    {next_finished_jobs, new_time} = first_finished(busy_workers)

    {next_available_jobs, new_queue} =
      complete_jobs(job_queue, next_finished_jobs)
      |> Enum.split_with(fn {_, v} -> Enum.empty?(v) end)
      |> (fn {next_available_jobs, new_queue_raw} ->
            {Enum.map(next_available_jobs, &elem(&1, 0)), Map.new(new_queue_raw)}
          end).()

    IO.puts("next avail")
    IO.inspect(next_available_jobs)

    %{
      time: new_time,
      free_workers: free_workers + length(next_finished_jobs),
      busy_workers: Map.drop(busy_workers, next_finished_jobs),
      available_jobs: Enum.sort(next_available_jobs ++ available_jobs),
      job_queue: new_queue,
      job_base_time: job_base_time,
      job_order: job_order <> Enum.join(next_finished_jobs)
    }
  end

  def first_finished(workers) do
    next_time = workers |> Enum.map(&elem(&1, 1)) |> Enum.min()

    finished_workers =
      workers
      |> Enum.filter(fn {_, time} -> time == next_time end)
      |> Enum.map(&elem(&1, 0))

    {
      finished_workers,
      next_time
    }
  end

  def assign(<<job::size(8)>>, curr_time, job_base_time \\ 0) do
    %{job: <<job>>, finished: curr_time + (job - 64) + job_base_time}
  end
end

File.stream!("input.txt") |> Enum.map(&String.trim/1) |> Day07.run(2) |> IO.inspect()
# File.stream!("test.txt") |> Enum.map(&String.trim/1) |> Day07.run(2) |> IO.inspect()

# Tried OPCUEXFHIRGWDZABTQYJMNKVSL
# Trying OPCUXEHFIRWZGADBTQYJMNKVSL
# Trying OPCUXEHFIRWZGDABTQYJMNKVSL
         OPCUXEHFIRWZGADBTQYJMNKVSL
