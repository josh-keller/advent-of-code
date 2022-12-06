package main

import (
	"fmt"
	"os"
	"strings"
)

type cave struct {
	name        string
	connections [](*cave)
	small       bool
}

type network struct {
	start *cave
	end   *cave
}

func main() {
	network := readData("input.txt")

	startPath := []*cave{network.start}
	paths := network.findAll(startPath)

	// for i, p := range paths {
	// 	fmt.Println(i+1, ": ", p)
	// }
	fmt.Println(len(paths))
}

func (n *network) findAll(visited []*cave) [][]*cave {
	paths := make([][]*cave, 0)
	currCave := visited[len(visited)-1]

	for _, next := range currCave.connections {
		if next.name == "end" {
			newPath := append(visited, next)
			paths = append(paths, newPath)
		} else if !next.small || !contains(visited, next) {
			newVisited := append(visited, next)
			paths = append(paths, n.findAll(newVisited)...)
		}
	}

	return paths
}

func contains(slc []*cave, target *cave) bool {
	for _, val := range slc {
		if val == target {
			return true
		}
	}

	return false
}

func readData(filename string) network {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	var start *cave
	var end *cave
	caves := make([]*cave, 0)

	lines := strings.Split(strings.TrimSpace(string(dat)), "\n")

	for _, line := range lines {
		pair := strings.Split(line, "-")
		if len(pair) != 2 {
			panic("More than two caves")
		}

		var c1, c2 *cave

		for _, cv := range caves {
			if cv.name == pair[0] {
				c1 = cv
			} else if cv.name == pair[1] {
				c2 = cv
			}
		}

		// fmt.Println("Before: ", c1, c2)

		if c1 == nil {
			c1 = newCave(pair[0])
			caves = append(caves, c1)
		}

		if c2 == nil {
			c2 = newCave(pair[1])
			caves = append(caves, c2)
		}

		// fmt.Println("After: ", c1, c2)
		c1.connections = append(c1.connections, c2)
		c2.connections = append(c2.connections, c1)

		if c1.name == "start" {
			start = c1
		} else if c1.name == "end" {
			end = c1
		}

		if c2.name == "start" {
			start = c2
		} else if c2.name == "end" {
			end = c2
		}
	}

	for _, c := range caves {
		c.print()
	}

	return network{start, end}
}

func (c *cave) print() {
	cons := make([]string, len(c.connections))
	for i, con := range c.connections {
		cons[i] = con.name
	}

	// fmt.Println(c.name, ": ", cons)
}

func newCave(name string) *cave {
	small := name[0] >= 'a' && name[0] <= 'z'
	connections := make([]*cave, 0)

	return &cave{name, connections, small}
}
