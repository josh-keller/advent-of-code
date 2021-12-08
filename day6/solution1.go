package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	school := *readData("input.txt")

	fmt.Println(school)
	for i := 1; i <= 80; i++ {
		numFish := len(school)

		for f := 0; f < numFish; f++ {
			if school[f] == 0 {
				school[f] = 6
				school = append(school, 8)
			} else {
				school[f]--
			}
		}
	}

	fmt.Println(len(school))
}

func readData(filename string) *[]int {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	strs := strings.Split(strings.TrimSpace(string(dat)), ",")
	nums := make([]int, len(strs))

	for i, str := range strs {
		nums[i], _ = strconv.Atoi(str)
	}

	return &nums
}
