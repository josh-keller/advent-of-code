package main

// Must run: go run heap.go part2.go

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type node struct {
	danger  int
	visited bool
}

type coord struct {
	x int
	y int
}

type chart [][]node

func main() {
	chrt := readData("input.txt")
	end := coord{len(chrt[0]) - 1, len(chrt) - 1}

	fmt.Println(dijkstra(chrt, coord{0, 0}, end))
}

func dijkstra(c chart, begin, end coord) int {
	lowestDanger := make(map[coord]int)
	lowestPrevCell := make(map[coord]coord)
	var minDanger minHeap
	lowestDanger[begin] = 0
	minDanger = minDanger.insert(begin, 0)

	visit := func(curr coord) {
		c.mark(curr)

		adjacent := getAdjacent(c, curr)

		for _, adjCell := range adjacent {
			currPathDanger := lowestDanger[curr] + c.at(adjCell).danger
			prevPathDanger, ex := lowestDanger[adjCell]

			if !ex || currPathDanger < prevPathDanger {
				lowestDanger[adjCell] = currPathDanger
				minDanger = minDanger.insert(adjCell, currPathDanger)
				lowestPrevCell[adjCell] = curr
			}
		}
	}

	for {
		var curr coord

		for {
			curr = minDanger.root().loc
			minDanger = minDanger.delete()
			if !c.at(curr).visited {
				break
			}
		}

		if curr == end {
			fmt.Println("end: ", curr)
			break
		}

		fmt.Println("visiting: ", curr)
		visit(curr)
	}

	return lowestDanger[end]
}

func (chrt chart) at(crd coord) node {
	return chrt[crd.y][crd.x]
}

func (chrt chart) mark(crd coord) {
	chrt[crd.y][crd.x].visited = true
}

func (chrt chart) contains(crd coord) bool {
	yMax := len(chrt)
	xMax := len((chrt)[0])

	return crd.x >= 0 && crd.x < xMax && crd.y >= 0 && crd.y < yMax
}

func getAdjacent(chrt chart, loc coord) []coord {
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

func incrementRow(row []node, by int) (result []node) {
	result = make([]node, len(row))
	for i, n := range row {
		newDanger := n.danger + by
		if newDanger >= 10 {
			newDanger -= 9
		}

		result[i] = node{newDanger, false}
	}

	return
}

func readData(filename string) chart {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(dat)), "\n")
	var result chart
	numLines := len(lines)
	result = make([]([]node), numLines)

	for i, line := range lines {
		strs := strings.Split(line, "")
		locs := make([]node, len(strs))
		for j, str := range strs {
			danger, e := strconv.Atoi(str)
			if e != nil {
				panic(e)
			}

			locs[j] = node{danger, false}
		}

		for k := 0; k <= 4; k++ {
			result[i] = append(result[i], incrementRow(locs, k)...)
		}
	}

	for i := 1; i <= 4; i++ {
		for j := 0; j < numLines; j++ {
			result = append(result, incrementRow(result[j], i))
		}
	}

	return result
}
