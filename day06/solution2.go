package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	input := *readData("input.txt")

	school := make([]int, 9)

	for _, num := range input {
		school[num]++
	}

	fmt.Println(school)

	for day := 1; day <= 256; day++ {
		curr := school[8]
		next := 0

		for i := 7; i >= 0; i-- {
			next = school[i]
			school[i] = curr
			curr = next
		}

		school[6] += curr
		school[8] = curr
	}

	sum := 0

	for _, val := range school {
		sum += val
	}

	fmt.Println(sum)
}

func readData(filename string) *[]int {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	strs := strings.Split(strings.TrimSpace(string(dat)), ",")
	nums := make([]int, len(strs))

	for i, str := range strs {
		val, e := strconv.Atoi(str)
		if e != nil {
			panic(e)
		}
		nums[i] = val
	}

	return &nums
}
