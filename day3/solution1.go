package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	data := *readData("input.txt")
	dlen := len(data)

	ones := make([]int, len(data[0]))

	for _, num := range data {
		for i, c := range num {
			if c == '1' {
				ones[i] += 1
			}
		}
	}

	gammaStr := ""
	epsilonStr := ""

	for _, count := range ones {
		if count > dlen/2 {
			gammaStr += "1"
			epsilonStr += "0"
		} else {
			gammaStr += "0"
			epsilonStr += "1"
		}
	}

	gamma, _ := strconv.ParseInt(gammaStr, 2, 32)
	epsilon, _ := strconv.ParseInt(epsilonStr, 2, 32)

	fmt.Println(gamma * epsilon)
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
