package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type coord struct {
	x int
	y int
}

func main() {
	coords, inst := readInput("input.txt")

	for _, instruction := range inst {
		nextCoords := make([]coord, 0, len(coords))
		foldDir := instruction[1]
		foldNum, err := strconv.Atoi(instruction[2])

		if err != nil {
			panic(err)
		}

		for _, c := range coords {
			var newC coord
			if foldDir == "x" {
				if c.x == foldNum {
					continue
				}

				newC = c.foldX(foldNum)
			} else {
				if c.y == foldNum {
					continue
				}

				newC = c.foldY(foldNum)
			}

			if !contains(nextCoords, newC) {
				nextCoords = append(nextCoords, newC)
			}
		}

		coords = nextCoords
	}

	var maxX, maxY int

	for _, c := range coords {
		if c.x > maxX {
			maxX = c.x
		}

		if c.y > maxY {
			maxY = c.y
		}
	}
	width := maxX + 1
	height := maxY + 1

	dots := make([][]string, height)

	for r := range dots {
		blanks := make([]string, width)

		for b := range blanks {
			blanks[b] = " "
		}

		dots[r] = blanks
	}

	for _, c := range coords {
		dots[c.y][c.x] = "#"
	}

	for _, row := range dots {
		for _, char := range row {
			fmt.Print(char)
		}
		fmt.Println()
	}
}

func contains(coords []coord, newC coord) bool {
	for _, c := range coords {
		if c == newC {
			return true
		}
	}

	return false
}

func (c coord) foldX(x int) coord {
	if c.x < x {
		return c
	}

	return coord{2*x - c.x, c.y}
}

func (c coord) foldY(y int) coord {
	if c.y < y {
		return c
	}

	return coord{c.x, 2*y - c.y}
}

func readInput(filename string) ([]coord, [][]string) {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	chunks := strings.Split(string(dat), "\n\n")
	coordStrs := strings.Split(strings.TrimSpace(chunks[0]), "\n")

	instRE := regexp.MustCompile(`fold along (x|y)=(\d*)`)
	instructions := instRE.FindAllStringSubmatch(chunks[1], -1)

	coords := make([]coord, len(coordStrs))

	for i, c := range coordStrs {
		xAndY := strings.Split(c, ",")
		x, e := strconv.Atoi(xAndY[0])
		if e != nil {
			panic(e)
		}

		y, e := strconv.Atoi(xAndY[1])
		if e != nil {
			panic(e)
		}

		coords[i] = coord{x, y}
	}

	return coords, instructions
}
