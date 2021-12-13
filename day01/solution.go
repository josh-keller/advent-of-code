package main

// Solved with Isaak, Steve, and Iului

import (
	"fmt"
	"strconv"
	"strings"
)

const sampleData = `
  199
  200
  208
  210
  200
  207
  240
  269
  260
  263`

func main() {
	depths := cleanData(sampleData)
	fmt.Println(countIncreases(windows(depths)))
}

func countIncreases(depths []int) int {
	increases := 0

	for i := 1; i < len(depths); i++ {
		if depths[i] > depths[i-1] {
			increases++
		}
	}

	return increases
}

func windows(depths []int) []int {
	var windows []int

	for i := 0; i <= (len(depths) - 3); i++ {
		sum := depths[i] + depths[i+1] + depths[i+2]
		windows = append(windows, sum)
	}

	return windows
}

func cleanData(inputStr string) []int {
	numStrings := strings.Fields(inputStr)
	cleanInts := make([]int, len(numStrings))

	for i, str := range numStrings {
		cleanInts[i], _ = strconv.Atoi(str)
	}

	return cleanInts
}
