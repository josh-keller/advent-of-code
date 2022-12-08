import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const splitLines = rawInput.trim().split("\n")
  console.log("Lines of input: ", splitLines.length)
  return splitLines.map(line => line.split('').map(d => Number(d)))
}

const part1 = (rawInput: string) => {
  const trees = parseInput(rawInput)
  const visTreeSet = new Set<string>()

  const rows = trees.length
  const cols = trees[0].length
  /* console.log(trees) */
  // Add from top, bottom, left, right. Set takes care of deduplication
  for (let r = 0; r < rows; r++) {
    let tallestToLeft = -1
    let tallestToRight = -1
    
    for (let c = 0; c < cols; c++) {
      if (trees[r][c] > tallestToLeft) {
        visTreeSet.add([r, c].toString())
        tallestToLeft = trees[r][c]
        if (tallestToLeft === 9) { break }
      }
    }

    for (let c = cols - 1; c >= 0; c--) {
      if (trees[r][c] > tallestToRight) {
        visTreeSet.add([r, c].toString())
        tallestToRight = trees[r][c]
        if (tallestToRight === 9) { break }
      }
    }
  }

  /* console.log("Size so far:", visTreeSet.size) */
  /* console.log("---------------------") */
  /* console.log(trees) */

  for (let c = 0; c < cols; c++) {
    let tallestAbove = -1
    let tallestBelow = -1
    for (let r = 0; r < rows; r++) {
      if (trees[r][c] > tallestAbove) {
        visTreeSet.add([r, c].toString())
        tallestAbove = trees[r][c]
      }
      if (tallestAbove === 9) { break }
    }

    for (let r = rows - 1; r >= 0; r--) {
      if (trees[r][c] > tallestBelow) {
        visTreeSet.add([r, c].toString())
        tallestBelow = trees[r][c]
      }
      if (tallestBelow === 9) { break }
    }
  }

  /* console.log(visTreeSet) */

  const totalVisibleTrees = visTreeSet.size
  return totalVisibleTrees
}

function calcScenicScore(trees: number[][], r: number, c: number): number {
  const rows = trees.length
  const cols = trees[0].length
  
  if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) {
    return 0
  }

  let right = 1, left = 1, up = 1, down = 1

  /* console.log('r, c:', r, c) */
  for (let i = 1; c + i < cols - 1 && trees[r][c] > trees[r][c+i]; i++) {
    right++
  }

  for (let i = 1; c - i > 0 && trees[r][c] > trees[r][c-i]; i++) {
    left++
  }

  for (let i = 1; r + i < rows - 1 && trees[r][c] > trees[r+i][c]; i++) {
    down++
  }

  for (let i = 1; r - i > 0 && trees[r][c] > trees[r-i][c]; i++) {
    up++
  }
  /* console.log("Calc scenic score", up, left, right, down) */

  return right * left * up * down

}

const part2 = (rawInput: string) => {
  const trees = parseInput(rawInput)
  console.log("TREES")
  console.log(trees)
  const scenicScores = trees.map((row, r) => row.map((col, c) => calcScenicScore(trees, r, c)))

  const maxEachRow = scenicScores.map(row => row.reduce((max, curr) => Math.max(max, curr)))
  console.log(maxEachRow)

  return scenicScores.map(row => row.reduce((max, curr) => Math.max(max, curr), 0)).reduce((max, curr) => Math.max(max, curr), 0) 
}

/*
function calcScenicScoreToRight(trees: number[][]): number[][] {
  const scores: number[][] = []

  trees.forEach((row) => {
    const currRow: number[] = []
    let start = 0
    let end = 0
    let currScore = 0
    while (start < row.length - 1) {
      while (end < row.length - 1 && (start === end || row[start] > row[end])) {
        console.log("s: ", start, "e:", end)
        end++
        currScore++
      }

      while (start < end) {
        console.log("s: ", start, "e:", end)
        currRow[start] = currScore
        start++
        currScore--
      }
    }

    currRow[row.length - 1] = 0
    scores.push(currRow)

  })

  return scores
}

function calcScenicScoreToLeft(trees: number[][]): number[][] {
  const scores: number[][] = []

  trees.forEach((row) => {
    const currRow: number[] = []
    let start = row.length - 1
    let end = start
    let currScore = 0
    while (start > 0) {
      while (end >  0 && (start === end || row[start] > row[end])) {
        console.log("s: ", start, "e:", end)
        end--
        currScore++
      }

      while (start > end) {
        console.log("s: ", start, "e:", end)
        currRow[start] = currScore
        start--
        currScore--
      }
    }

    currRow[0] = 0
    scores.push(currRow)

  })

  return scores
}
*/

run({
  part1: {
    tests: [
      {
        input: `
30373
25512
65332
33549
35390
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
30373
25512
65332
33549
35390
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
