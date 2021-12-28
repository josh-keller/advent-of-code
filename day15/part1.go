package main

import (
	"fmt"
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
	chrt := readData("sample2.txt")
	end := coord{len(chrt[0]) - 1, len(chrt) - 1}

	fmt.Println(dijkstra(chrt, coord{0, 0}, end))
}

func dijkstra(c chart, begin, end coord) int {
	lowestDanger := make(map[coord]int)
	lowestPrevCell := make(map[coord]coord)
	lowestDanger[begin] = 0

	visit := func(curr coord) {
		c.mark(curr)

		adjacent := getAdjacent(c, curr)

		for _, adjCell := range adjacent {
			currPathDanger := lowestDanger[curr] + c.at(adjCell).danger
			prevPathDanger, ex := lowestDanger[adjCell]

			if !ex || currPathDanger < prevPathDanger {
				lowestDanger[adjCell] = currPathDanger
				lowestPrevCell[adjCell] = curr
			}
		}
	}

	minDanger := func() coord {
		min := 1000000
		var minCell coord

		for cell, danger := range lowestDanger {
			visited := c.at(cell).visited

			if !visited && danger < min {
				min = danger
				minCell = cell
			}
		}

		return minCell
	}

	for curr := begin; curr != end; curr = minDanger() {
		visit(curr)
	}

	return lowestDanger[end]
}
