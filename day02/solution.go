package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type movement struct {
	command  string
	distance int
}

type position struct {
	horizontal int
	depth      int
	aim        int
}

func readData(filename string) *[]movement {
	data, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	movements := make([]movement, len(lines))

	for i, line := range lines {
		movements[i] = parseMovement(line)
	}

	return &movements
}

func parseMovement(raw string) movement {
	fields := strings.Fields(raw)
	distance, _ := strconv.Atoi(fields[1])
	m := movement{fields[0], distance}

	return m
}

func (p *position) move1(m movement) {
	switch m.command {
	case "forward":
		p.horizontal += m.distance
	case "down":
		p.depth += m.distance
	case "up":
		p.depth -= m.distance
	}
}

func (p *position) move2(m movement) {
	switch m.command {
	case "forward":
		p.horizontal += m.distance
		p.depth += m.distance * p.aim
	case "down":
		p.aim += m.distance
	case "up":
		p.aim -= m.distance
	}
}

func main() {
	movements := *readData("./data.txt")

	position1 := position{0, 0, 0}

	for _, m := range movements {
		position1.move1(m)
	}

	fmt.Println(position1.horizontal * position1.depth)

	position2 := position{0, 0, 0}

	for _, m := range movements {
		position2.move2(m)
	}

	fmt.Println(position2.horizontal * position2.depth)
}
