package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type point struct {
	x int
	y int
}

type line struct {
	p0 point
	p1 point
}

func main() {

	lines := *readData("sampleInput.txt")

	maxX, maxY := maxCoords(&lines)
	maxX += 1
	maxY += 1

	floor := make([][]int, maxY)
	rows := make([]int, maxX*maxY)
	for i := 0; i < maxY; i++ {
		floor[i] = rows[i*maxX : (i+1)*maxX]
	}

	for _, line := range lines {
		points := *line.expand()

		for _, point := range points {
			increment(&floor, point.x, point.y)
		}
	}

	for _, row := range floor {
		fmt.Println(row)
	}

	count := 0

	for _, row := range floor {
		for _, p := range row {
			if p > 1 {
				count++
			}
		}
	}

	fmt.Println(count)
}

func printFloor(floor *[][]int) {
	for _, row := range *floor {
		fmt.Println(row)
	}
}

func (l line) expand() *[]point {
	var numPoints, xDiff, yDiff int
	inc := point{0, 0}

	xDiff = l.p1.x - l.p0.x
	yDiff = l.p1.y - l.p0.y

	if xDiff > 0 {
		inc.x = 1
		numPoints = xDiff + 1
	} else if xDiff < 0 {
		inc.x = -1
		numPoints = (-xDiff) + 1
	}

	if yDiff > 0 {
		inc.y = 1
		numPoints = yDiff + 1
	} else if yDiff < 0 {
		inc.y = -1
		numPoints = (-yDiff) + 1
	}

	linePoints := make([]point, numPoints)
	linePoints[0] = l.p0

	for i := 1; i < numPoints; i++ {
		linePoints[i] = linePoints[i-1].add(inc)
	}

	return &linePoints
}

func (p point) add(other point) point {
	p.x += other.x
	p.y += other.y

	return p
}

func increment(c *[][]int, x int, y int) {
	(*c)[y][x]++
}

func maxCoords(lines *[]line) (maxX int, maxY int) {
	for _, line := range *lines {
		if line.p0.x > maxX {
			maxX = line.p0.x
		}

		if line.p0.y > maxY {
			maxY = line.p0.y
		}

		if line.p1.x > maxX {
			maxX = line.p1.x
		}

		if line.p1.y > maxY {
			maxY = line.p1.y
		}
	}

	return
}

func readData(filename string) *[]line {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	inputLines := strings.Split(strings.TrimSpace(string(dat)), "\n")
	lines := *parseLines(&inputLines)

	return &lines

}

func parseLines(input *[]string) *[]line {
	lines := make([]line, len(*input))

	for i, str := range *input {
		lines[i] = parseLine(str)
	}

	return &lines
}

func parseLine(input string) line {
	strs := strings.Split(input, " -> ")

	p0 := parsePoint(strs[0])
	p1 := parsePoint(strs[1])

	return line{p0, p1}
}

func parsePoint(input string) point {
	coords := strings.Split(input, ",")
	x, _ := strconv.Atoi(coords[0])
	y, _ := strconv.Atoi(coords[1])

	return point{x, y}
}

func (l line) isVert() bool {
	return l.p0.x == l.p1.x
}

func (l line) isHoriz() bool {
	return l.p0.y == l.p1.y
}
