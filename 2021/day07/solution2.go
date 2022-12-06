package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"math"
)

func main() {
	data := readData("input.txt")

	mean := int(math.Floor(average(&data)))
	fmt.Println(mean)

	totalFuel := 0

	for _, n := range data {
		dist := n - mean
		if dist < 0 {
			dist = -dist
		}

		fuel := calcFuel(dist)
		// fmt.Println("n: ", n, ", f: ", fuel)
		totalFuel += fuel
	}

	fmt.Println(totalFuel)
}

func calcFuel(dist int) int {
	return (dist * (dist + 1)) / 2
}

func average(nums *[]int) float64 {
	sum := 0

	for _, n := range *nums {
		sum += n
	}

	return float64(sum) / float64(len(*nums))
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
