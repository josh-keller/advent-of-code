package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	floorMap := readData("input.txt")
	fmt.Println("Initial State")

	for i := 1; i < 1000; i++ {
		newMap := nextMap(floorMap)

		// fmt.Println("After ", i, " steps:\n")
		// print(newMap)

		if comp(floorMap, newMap) {
			fmt.Println(i, "STEPS")
			break
		}

		floorMap = newMap
	}
}

func comp(a, b [][]string) bool {

	for i := 0; i < len(a); i++ {
		for j := 0; j < len(a[0]); j++ {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}

	return true
}

func print(fm [][]string) {
	for _, row := range fm {
		fmt.Println(strings.Join(row, ""))
	}
	fmt.Println()
}

func nextMap(floorMap [][]string) [][]string {
	newEastMap := make([][]string, len(floorMap))
	height := len(floorMap)
	width := len(floorMap[0])

	for i, line := range floorMap {
		newLine := make([]string, len(line))

		for j := 0; j < width-1; j++ {
			if line[j] == ">" && line[j+1] == "." {
				newLine[j] = "."
				newLine[j+1] = ">"
				j++
			} else {
				newLine[j] = line[j]
			}
		}

		if line[width-1] == ">" && line[0] == "." {
			newLine[0] = ">"
			newLine[width-1] = "."
		} else if newLine[width-1] != ">" {
			newLine[width-1] = line[width-1]
		}

		newEastMap[i] = newLine
	}

	newSouthMap := make([][]string, height)
	for i := 0; i < height; i++ {
		newLine := make([]string, width)
		newSouthMap[i] = newLine
	}

	for i := 0; i < height-1; i++ {
		for j := 0; j < width; j++ {
			if newSouthMap[i][j] == "v" {
				continue
			}

			if newEastMap[i][j] == "v" && newEastMap[i+1][j] == "." {
				newSouthMap[i][j] = "."
				newSouthMap[i+1][j] = "v"
			} else {
				newSouthMap[i][j] = newEastMap[i][j]
			}
		}

	}

	for j := 0; j < width; j++ {
		if newSouthMap[height-1][j] == "v" {
			continue
		}
		if newEastMap[height-1][j] == "v" && newEastMap[0][j] == "." {
			newSouthMap[height-1][j] = "."
			newSouthMap[0][j] = "v"
		} else {
			newSouthMap[height-1][j] = newEastMap[height-1][j]
		}
	}

	return newSouthMap
}

func readData(filename string) [][]string {
	f, err := os.Open(filename)
	defer f.Close()

	if err != nil {
		panic(err)
	}

	s := bufio.NewScanner(f)

	lines := make([][]string, 0)

	for s.Scan() {
		line := strings.Split(s.Text(), "")
		lines = append(lines, line)
	}

	return lines

}
