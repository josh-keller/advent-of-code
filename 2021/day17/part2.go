package main

import (
	"fmt"
	"math"
)

// Test data:
// const left = 20
// const right = 30
// const bot = -10
// const top = -5

// target area: x=57..116, y=-198..-148
const left = 57
const right = 116
const bot = -198
const top = -148

func main() {
	dxMax := right
	dxMin := int(math.Ceil((math.Sqrt(1+8*float64(left)) - 1) / 2))
	dyMax := int(math.Floor(math.Abs(float64(bot)) - 1))
	dyMin := bot
	hits := make([][2]int, 0)

	for dx := dxMin; dx <= dxMax; dx++ {
		for dy := dyMin; dy <= dyMax; dy++ {
			if isGoodShot(dx, dy) {
				hits = append(hits, [2]int{dx, dy})
			}
		}
	}

	fmt.Println("Hits: ", hits)
	fmt.Println()
	fmt.Println("Total: ", len(hits))
}

func isGoodShot(dx, dy int) bool {
	currX := 0
	currY := 0

	for {
		currX += dx
		currY += dy

		dy -= 1
		if dx > 0 {
			dx -= 1
		}

		if hit(currX, currY) {
			return true
		}

		if passed(currX, currY) {
			break
		}
	}

	return false
}

func hit(x, y int) bool {
	return x >= left && x <= right && y >= bot && y <= top
}

func passed(x, y int) bool {
	return x > right || y < bot
}
