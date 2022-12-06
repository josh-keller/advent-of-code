import run from "aocrunner"

type MoveLetter = "A" | "B" | "C" | "X" | "Y" | "Z"
type MoveName = "rock" | "paper" | "scissor"
type Move = Rock | Paper | Scissor

type Rock = {
  type: "rock"
  beats: "scissor"
  score: 1
}

type Paper = {
  type: "paper"
  beats: "rock"
  score: 2
}

type Scissor = {
  type: "scissor"
  beats: "paper"
  score: 3
}

const makeMove = (rawMove: MoveLetter | MoveName): Move => {
  switch (rawMove) {
    case "A":
    case "X":
    case "rock":
      return { type: "rock", beats: "scissor", score: 1 }
    case "B":
    case "Y":
    case "paper":
      return { type: "paper", beats: "rock", score: 2 }
    case "C":
    case "Z":
    case "scissor":
      return { type: "scissor", beats: "paper", score: 3 }
  }
}

function assertRawElfMove(raw: unknown): asserts raw is "A" | "B" | "C" {
  if (!(raw === "A" || raw === "B" || raw === "C")) {
    throw new Error("Bad elfMove")
  }
}

function assertRawMyMove(raw: unknown): asserts raw is "X" | "Y" | "Z" {
  if (!(raw === "X" || raw === "Y" || raw === "Z")) {
    throw new Error("Bad myMove")
  }
}

const parseLine1 = (line: string): [Move, Move] => {
  const [rawElfMove, rawMyMove] = line.split(" ")
  assertRawElfMove(rawElfMove)
  assertRawMyMove(rawMyMove)

  return [makeMove(rawElfMove), makeMove(rawMyMove)]
}

const parseLine2 = (line: string): [Move, Move] => {
  const [rawElfMove, rawMyMove] = line.split(" ")
  assertRawElfMove(rawElfMove)
  assertRawMyMove(rawMyMove)

  const elfMove = makeMove(rawElfMove)
  let myMove: Move

  switch (rawMyMove) {
    case "X":
      myMove = makeMove(elfMove.beats)
      break
    case "Y":
      myMove = makeMove(elfMove.type)
      break
    case "Z":
      myMove =
        elfMove.type === "rock"
          ? makeMove("paper")
          : elfMove.type === "paper"
          ? makeMove("scissor")
          : makeMove("rock")
      break
  }

  return [elfMove, myMove]
}

const parseInput = (rawInput: string, round: 1 | 2) => {
  const splitInput = rawInput.split("\n")
  return round === 1 ? splitInput.map(parseLine1) : splitInput.map(parseLine2)
}

const playRound = ([elfMove, myMove]: [Move, Move]): number => {
  let score = myMove.score
  score +=
    myMove.beats === elfMove.type ? 6 : elfMove.beats === myMove.type ? 0 : 3

  return score
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput, 1)

  return input.map(playRound).reduce((total, score) => total + score)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput, 2)

  return input.map(playRound).reduce((total, score) => total + score)
}

run({
  part1: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z
        `,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
