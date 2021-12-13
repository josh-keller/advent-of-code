package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	data := readData("input.txt")
	fmt.Println(data)

	dangerValSum := 0

	for i, row := range data {
		fmt.Println("***** Row ", i)
		for j, height := range row {
			adjacent := getAdjacent(&data, i, j)
			lowPoint := true
			// fmt.Println("h: ", height)
			// fmt.Println("a: ", adjacent)

			for _, h := range adjacent {
				if h <= height {
					lowPoint = false
					break
				}
			}

			// fmt.Println("lowpoint: ", lowPoint, "\n----------")

			if lowPoint {
				dangerValSum += (1 + height)
				fmt.Println("lp: ", height, "@ (", i, ",", j, ")")
			}
		}
	}

	fmt.Println(dangerValSum)
}

func getAdjacent(slc *[][]int, x0, y0 int) []int {
	adjacent := make([]int, 0, 4)

	xMinus := x0 - 1
	xPlus := x0 + 1
	yMinus := y0 - 1
	yPlus := y0 + 1

	if xMinus >= 0 {
		adjacent = append(adjacent, (*slc)[xMinus][y0])
	}

	if yMinus >= 0 {
		adjacent = append(adjacent, (*slc)[x0][yMinus])
	}

	if xPlus < len(*slc) {
		adjacent = append(adjacent, (*slc)[xPlus][y0])
	}

	if yPlus < len((*slc)[0]) {
		adjacent = append(adjacent, (*slc)[x0][yPlus])
	}

	return adjacent
}

func readData(filename string) (result [][]int) {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(dat)), "\n")
	result = make([][]int, len(lines))

	for i, line := range lines {
		strs := strings.Split(line, "")
		nums := make([]int, len(strs))
		for j, str := range strs {
			num, e := strconv.Atoi(str)
			if e != nil {
				panic(e)
			}

			nums[j] = num
		}

		result[i] = nums
	}

	return
}
