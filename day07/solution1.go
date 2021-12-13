package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

func main() {
	data := readData("input.txt")
	sort.Ints(data)

	median := data[len(data)/2]

	sumOfDiffs := 0

	for _, n := range data {
		diff := n - median
		if diff < 0 {
			diff = -diff
		}

		sumOfDiffs += diff
	}

	fmt.Println(sumOfDiffs)
}

func readData(filename string) []int {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	strs := strings.Split(strings.TrimSpace(string(dat)), ",")
	nums := make([]int, len(strs))

	for i, n := range strs {
		nums[i], _ = strconv.Atoi(n)
	}

	return nums
}
