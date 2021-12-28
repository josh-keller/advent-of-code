package main

import "fmt"

type die struct {
	rolls    int
	lastRoll int
}

type player struct {
	pos   int
	score int
}

func (p *player) move(spaces int) {
	p.pos += spaces

	for p.pos > 10 {
		p.pos -= 10
	}

	p.score += p.pos
}

func (d *die) roll() int {
	d.rolls++
	d.lastRoll++
	if d.lastRoll == 101 {
		d.lastRoll = 1
	}

	return d.lastRoll
}

const startP1 = 8
const startP2 = 4

func main() {
	p1 := player{startP1, 0}
	p2 := player{startP2, 0}
	die := die{0, 0}

	currentPlayer := p1
	otherPlayer := p2

	for {
		spaces := 0
		for i := 1; i <= 3; i++ {
			spaces += die.roll()
		}

		currentPlayer.move(spaces)

		if currentPlayer.score >= 1000 {
			break
		}

		currentPlayer, otherPlayer = otherPlayer, currentPlayer
	}

	fmt.Println(otherPlayer.score * die.rolls)
}
