package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type square struct {
	number int
	marked bool
}

type board [5][5]square

func main() {
	numsPtr, boardsPtr := readData("./input.txt")
	nums, boards := *numsPtr, *boardsPtr

	fmt.Println(callNums(nums, boards))
}

func callNums(nums []int, boards []board) int {
	winners := make([]bool, len(boards))

	for _, num := range nums {
		fmt.Println(num)
		for i := 0; i < len(boards); i++ {
			boards[i].mark(num)
			if boards[i].isWinner() {
				winners[i] = true
			}

			if totalWinners(winners) == len(boards) {
				return boards[i].sum() * num
			}
		}
	}
	return -1
}

func totalWinners(winners []bool) (tot int) {
	for _, win := range winners {
		if win {
			tot++
		}
	}

	return
}

func (b *board) sum() (sum int) {
	for _, row := range b {
		for _, square := range row {
			if !square.marked {
				sum += square.number
			}
		}
	}

	return sum
}

func readData(filename string) (*[]int, *[]board) {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(string(dat), "\n\n")

	nums := *convertNums(lines[0])
	boards := make([]board, len(lines)-1)

	for i := 1; i < len(lines); i++ {
		boards[i-1].readBoard(lines[i])
	}

	return &nums, &boards
}

func convertNums(line string) *[]int {
	numStrings := strings.Split(line, ",")
	nums := make([]int, len(numStrings))

	for i, str := range numStrings {
		nums[i], _ = strconv.Atoi(str)
	}

	return &nums
}

func (b *board) readBoard(input string) {
	for i, line := range strings.Split(input, "\n") {
		for n, num := range strings.Fields(line) {
			b[i][n].number, _ = strconv.Atoi(num)
		}
	}
}

func (b *board) mark(number int) bool {
	for i := 0; i < 5; i++ {
		for j := 0; j < 5; j++ {
			if b[i][j].number == number {
				b[i][j].marked = true
				return true
			}
		}
	}

	return false
}

func (b *board) isWinner() bool {
	// Check rows
Rows:
	for r := 0; r < 5; r++ {
		for c := 0; c < 5; c++ {
			if b[r][c].marked == false {
				continue Rows
			}
		}
		return true
	}

Cols:
	for c := 0; c < 5; c++ {
		for r := 0; r < 5; r++ {
			if b[r][c].marked == false {
				continue Cols
			}
		}
		return true
	}

	return false
	// diagonal := true

	// for i := 0; i < 5; i++ {
	// 	if b[i][i].marked == false {
	// 		diagonal = false
	// 		break
	// 	}
	// }

	// if diagonal == true {
	// 	return true
	// }

	// diagonal = true

	// for i := 0; i < 5; i++ {
	// 	if b[i][5-i-1].marked == false {
	// 		diagonal = false
	// 		break
	// 	}
	// }

	// return diagonal
}
