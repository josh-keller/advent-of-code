defmodule Day07Test do
  use ExUnit.Case
  doctest Day07

  test "assign a job" do
    assert Day07.assign("A", 0) == %{job: "A", finished: 1}
    assert Day07.assign("A", 1) == %{job: "A", finished: 2}
    assert Day07.assign("A", 1, 60) == %{job: "A", finished: 62}
    assert Day07.assign("C", 1) == %{job: "C", finished: 4}
  end

  test "dispatch job" do
    jq = %{ "A" => ["C"], "B" => ["A"], "D" => ["A"], "E" => ["F", "D", "B"], "F" => ["C"] }
    assert Day07.dispatch(%{
      time: 0,
      free_workers: 2,
      busy_workers: %{},
      available_jobs: ["C"],
      job_queue: jq,
      job_base_time: 0
    }) == %{
      time: 0,
      free_workers: 1,
      busy_workers: %{"C" => 3},
      available_jobs: [],
      job_queue: jq,
      job_base_time: 0
    }
    assert Day07.dispatch(%{
      time: 0,
      free_workers: 2,
      busy_workers: %{},
      available_jobs: ["C", "G"],
      job_queue: jq,
      job_base_time: 0
    }) == %{
      time: 0,
      free_workers: 0,
      busy_workers:  %{"G" => 7, "C" => 3},
      available_jobs: [],
      job_queue: jq,
      job_base_time: 0
    }
    assert Day07.dispatch(%{
      time: 0,
      free_workers: 0,
      busy_workers: %{},
      available_jobs: ["C", "G"],
      job_queue: jq,
      job_base_time: 0
    }) == %{
      time: 0,
      free_workers: 0,
      busy_workers: %{},
      available_jobs: ["C", "G"],
      job_queue: jq,
      job_base_time: 0
    }
    assert Day07.dispatch(%{
      time: 0,
      free_workers: 2,
      busy_workers: %{},
      available_jobs: [],
      job_queue: jq,
      job_base_time: 0
    }) == %{
      time: 0,
      free_workers: 2,
      busy_workers: %{},
      available_jobs: [],
      job_queue: jq,
      job_base_time: 0
    }
  end

  test "complete job" do
    jq = %{ "A" => ["C"], "B" => ["A"], "D" => ["A"], "E" => ["F", "D", "B"], "F" => ["C"] }
    assert Day07.complete_next_job(%{
      time: 0,
      free_workers: 1,
      busy_workers: %{"c" => 3},
      available_jobs: [],
      job_queue: jq,
      job_base_time: 0,
      job_order: ""
    }) == %{
      time: 3,
      free_workers: 2,
      busy_workers: %{},
      available_jobs: ["A", "F"],
      job_queue: jq |> Map.drop(["A", "F"]),
      job_base_time: 0,
      job_order: "C"
    }
  end

  test "first finished" do
    assert Day07.first_finished(%{"A" => 1}) == {["A"], 1}
    assert Day07.first_finished(%{"A" => 1, "B" => 2}) == {["A"], 1}
    assert Day07.first_finished(%{"A" => 1, "B" => 2, "C" => 1}) == {["A", "C"], 1}
    assert Day07.first_finished(%{"A" => 2, "B" => 2, "C" => 1}) == {["C"], 1}
  end

  test "complete jobs" do
    jq = %{ "A" => ["C"], "B" => ["A"], "D" => ["A"], "E" => ["F", "D", "B"], "F" => ["C"] }
    assert Day07.complete_jobs(jq, ["C"]) == %{ "A" => [], "B" => ["A"], "D" => ["A"], "E" => ["F", "D", "B"], "F" => [] } 
  end
end


