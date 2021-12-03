package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func countBinaryDigits(data []string) ([]int, []int) {
	ones := make([]int, len(data[0]))
	zeros := make([]int, len(data[0]))

	for _, num := range data {
		for i, c := range num {
			if c == '1' {
				ones[i] += 1
			} else {
				zeros[i] += 1
			}
		}
	}

	return zeros, ones
}

func mostCommon(data []string) []byte {
	zeros, ones := countBinaryDigits(data)

	mostCommon := make([]byte, len(data[0]))

	for i := 0; i < len(ones); i++ {
		if ones[i] >= zeros[i] {
			mostCommon[i] = byte('1')
		} else {
			mostCommon[i] = byte('0')
		}
	}

	return mostCommon
}

func leastCommon(data []string) []byte {
	zeros, ones := countBinaryDigits(data)

	leastCommon := make([]byte, len(data[0]))

	for i := 0; i < len(ones); i++ {
		if zeros[i] <= ones[i] {
			leastCommon[i] = byte('0')
		} else {
			leastCommon[i] = byte('1')
		}
	}

	return leastCommon
}

func progressiveFilter(data []string, filter func([]string) []byte) string {
	filterData := make([]string, len(data))
	copy(filterData, data)

	for i := 0; i < len(data[0]); i++ {
		test := filter(filterData)
		newFilterData := make([]string, 0)

		for _, str := range filterData {
			if str[i] == test[i] {
				newFilterData = append(newFilterData, str)
			}
		}

		filterData = newFilterData

		if len(filterData) == 1 {
			return filterData[0]
		}
	}
	return ""
}

func main() {
	data := *readData("input.txt")
	// dlen := len(data)

	oxygen, _ := strconv.ParseInt(progressiveFilter(data, mostCommon), 2, 32)
	co2, _ := strconv.ParseInt(progressiveFilter(data, leastCommon), 2, 32)

	fmt.Println("O2: ", oxygen)
	fmt.Println("CO2: ", co2)
	fmt.Println("Final: ", oxygen * co2)
}

func readData(filename string) *[]string {
	data, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	binaryStrings := make([]string, len(lines))

	for i, line := range lines {
		binaryStrings[i] = line
	}

	return &binaryStrings
}
