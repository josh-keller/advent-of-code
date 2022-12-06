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

	fmt.Println(coords)
	fmt.Println(inst)

	nextCoords := make([]coord, 0, len(coords))
	foldDir := inst[0][1]
	foldNum, _ := strconv.Atoi(inst[0][2])

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

	fmt.Println(nextCoords)
	fmt.Println(len(nextCoords))
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
