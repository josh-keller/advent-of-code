package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type octopus struct {
	energy  int
	flashed bool
}

type node struct {
	val  coord
	next *node
}

type coord struct {
	x int
	y int
}

type queue struct {
	head   *node
	tail   *node
	length int
}

type chart [][]octopus

func (chrt *chart) at(x, y int) octopus {
	return (*chrt)[y][x]
}

func (chrt *chart) addEnergy(toFlash *queue, x, y int) {
	oct := &(*chrt)[y][x]

	if !oct.flashed {
		oct.energy += 1

		if oct.energy > 9 {
			oct.flashed = true
			toFlash.push(coord{x, y})
		}
	}
}

func (chrt *chart) contains(crd coord) bool {
	yMax := len(*chrt)
	xMax := len((*chrt)[0])

	return crd.x >= 0 && crd.x < xMax && crd.y >= 0 && crd.y < yMax
}

func getAdjacent(chrt *chart, x, y int) []coord {
	adjacent := make([]coord, 0, 8)

	for dx := -1; dx <= 1; dx++ {
		for dy := -1; dy <= 1; dy++ {
			if dx == 0 && dy == 0 {
				continue
			}
			crd := coord{x + dx, y + dy}

			if chrt.contains(crd) {
				adjacent = append(adjacent, crd)
			}
		}
	}

	return adjacent
}

func main() {
	octopi := *readData("input.txt")
	totalOctopi := len(octopi) * len(octopi[0])
	toFlash := newQueue()
	totalFlashes := 0

	for n := 1; n < 10000; n++ {
		roundFlashes := 0

		// 		fmt.Println("----BEFORE ", n, "----")
		// 		octopi.display()

		for y, row := range octopi {
			for x, _ := range row {
				octopi.addEnergy(&toFlash, x, y)
			}
		}

		fmt.Println(toFlash)

		for {
			if toFlash.length == 0 {
				break
			}

			crd := toFlash.pop()
			octopi[crd.y][crd.x].energy = 0
			adj := getAdjacent(&octopi, crd.x, crd.y)

			for _, c := range adj {
				octopi.addEnergy(&toFlash, c.x, c.y)
			}

			totalFlashes += 1
			roundFlashes += 1
		}

		// fmt.Println("----AFTER ", n, "----")
		// octopi.display()

		fmt.Println("Total flashes: ", totalFlashes)

		for y, row := range octopi {
			for x, _ := range row {
				octopi[y][x].flashed = false
			}
		}

		if roundFlashes == totalOctopi {
			fmt.Println(n)
			break
		}
	}

	// fmt.Println("----AFTER----")
	// octopi.display()

	// fmt.Println(totalFlashes)

}

func (c *chart) display() {
	for _, row := range *c {
		for _, oct := range row {
			if oct.flashed {
				fmt.Print("* ")
			} else {
				fmt.Print(oct.energy, " ")
			}
		}
		fmt.Println()
	}
}

func readData(filename string) *chart {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(dat)), "\n")
	var octopi chart
	octopi = make([]([]octopus), len(lines))

	for i, line := range lines {
		strs := strings.Split(line, "")
		octs := make([]octopus, len(strs))
		for j, str := range strs {
			energy, e := strconv.Atoi(str)
			if e != nil {
				panic(e)
			}

			octs[j] = octopus{energy, false}
		}

		octopi[i] = octs
	}

	return &octopi
}

func (q *queue) push(val coord) int {
	n := node{val, nil}

	if q.length != 0 {
		q.tail.next = &n
	}

	q.tail = &n
	q.length += 1

	if q.length == 1 {
		q.head = &n
	}

	return q.length
}

func (q *queue) pop() coord {
	if q.length == 0 {
		panic("Cannot pop from an empty queue!")
	}

	n := *q.head
	q.head = n.next
	q.length -= 1

	if q.length == 0 {
		q.tail = nil
	}

	return n.val
}

func newQueue() queue {
	return queue{nil, nil, 0}
}

func (q *queue) print() {
	ptr := q.head

	fmt.Print("queue(", q.length, "): [")

	for ptr != nil {
		fmt.Print(ptr.val)
		if ptr.next != nil {
			fmt.Print(" ")
		}

		ptr = ptr.next
	}

	fmt.Println("]")
}
