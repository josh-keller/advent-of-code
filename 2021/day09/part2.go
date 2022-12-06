package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

type location struct {
	height  int
	visited bool
}

type coord struct {
	x int
	y int
}

type chart [][]location

func main() {
	chrt := *readData("input.txt")

	lowPoints := make([]coord, 0)

	for y, row := range chrt {
		for x, loc := range row {
			crd := coord{x, y}
			adjacent := getAdjacent(&chrt, crd)
			lowPoint := true

			for _, adj := range adjacent {
				if chrt.at(adj).height <= loc.height {
					lowPoint = false
					break
				}
			}

			if lowPoint {
				lowPoints = append(lowPoints, crd)
			}
		}
	}

	basinSizes := make([]int, len(lowPoints))

	for i, lp := range lowPoints {
		basinSizes[i] = findBasinSize(&chrt, lp)
	}

	top3BasinSizes := make([]int, 3)

	for _, currSize := range basinSizes {
		if currSize > top3BasinSizes[0] {
			top3BasinSizes[0] = currSize
		}

		sort.Slice(top3BasinSizes, func(i, j int) bool {
			return top3BasinSizes[i] < top3BasinSizes[j]
		})
	}

	fmt.Println(top3BasinSizes)

	product := 1

	for _, size := range top3BasinSizes {
		product *= size
	}

	fmt.Println(product)
}

func findBasinSize(chrt *chart, start coord) int {
	currLoc := chrt.at(start)
	if currLoc.visited || currLoc.height == 9 {
		return 0
	}

	chrt.mark(start)
	totalBasinSize := 1
	adjacent := getAdjacent(chrt, start)

	for _, adjCrd := range adjacent {
		totalBasinSize += findBasinSize(chrt, adjCrd)
	}

	return totalBasinSize
}

func (chrt *chart) at(crd coord) location {
	return (*chrt)[crd.y][crd.x]
}

func (chrt *chart) mark(crd coord) {
	(*chrt)[crd.y][crd.x].visited = true
}

func (chrt *chart) contains(crd coord) bool {
	yMax := len(*chrt)
	xMax := len((*chrt)[0])

	return crd.x >= 0 && crd.x < xMax && crd.y >= 0 && crd.y < yMax
}

func getAdjacent(chrt *chart, loc coord) []coord {
	adjacent := make([]coord, 0, 4)

	left := coord{loc.x - 1, loc.y}
	right := coord{loc.x + 1, loc.y}
	up := coord{loc.x, loc.y - 1}
	down := coord{loc.x, loc.y + 1}

	if chrt.contains(left) {
		adjacent = append(adjacent, left)
	}

	if chrt.contains(up) {
		adjacent = append(adjacent, up)
	}

	if chrt.contains(right) {
		adjacent = append(adjacent, right)
	}

	if chrt.contains(down) {
		adjacent = append(adjacent, down)
	}

	return adjacent
}

func readData(filename string) *chart {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(dat)), "\n")
	var result chart
	result = make([]([]location), len(lines))

	for i, line := range lines {
		strs := strings.Split(line, "")
		locs := make([]location, len(strs))
		for j, str := range strs {
			height, e := strconv.Atoi(str)
			if e != nil {
				panic(e)
			}

			locs[j] = location{height, false}
		}

		result[i] = locs
	}

	return &result
}
