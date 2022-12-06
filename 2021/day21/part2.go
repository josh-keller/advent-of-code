package main

import "fmt"

type player struct {
	pos   int
	score int
}

type state struct {
	p1       player
	p2       player
	nextMove int
}

type worldSet struct {
	stateCounts  map[state]uint64
	winnerCounts map[int]uint64
}

func (s state) nextStates() map[int]state {
	next := make(map[int]state)

	for i := 3; i <= 9; i++ {
		if s.nextMove == 1 {
			newP1 := s.p1.move(i)
			next[i] = state{newP1, s.p2, 2}
		} else {
			newP2 := s.p2.move(i)
			next[i] = state{s.p1, newP2, 1}
		}
	}

	return next
}

func (ws worldSet) next() *worldSet {
	multipliers := map[int]uint64{3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1}
	newWorldSet := new(worldSet)
	newWorldSet.winnerCounts = ws.winnerCounts

	nextStateCounts := make(map[state]uint64)
	for state, count := range ws.stateCounts {
		nextStates := state.nextStates()

		for i := 3; i <= 9; i++ {
			nextState, ex := nextStates[i]

			if !ex {
				panic("invalid state")
			}

			nextStateCounts[nextState] += count * multipliers[i]
		}
	}

	for state, count := range nextStateCounts {
		if winner := winner(state); winner != 0 {
			newWorldSet.winnerCounts[winner] += count
			delete(nextStateCounts, state)
		}
	}

	newWorldSet.stateCounts = nextStateCounts

	return newWorldSet
}

func winner(s state) int {
	const threshold = 21

	if s.p1.score >= threshold {
		return 1
	} else if s.p2.score >= threshold {
		return 2
	} else {
		return 0
	}
}

func (p player) move(spaces int) player {
	p.pos += spaces

	for p.pos > 10 {
		p.pos -= 10
	}

	p.score += p.pos

	return p
}

const startP1 = 8
const startP2 = 4

func main() {
	p1 := player{startP1, 0}
	p2 := player{startP2, 0}
	startingState := state{p1, p2, 1}
	startingCounts := map[state]uint64{startingState: 1}
	startingWinners := map[int]uint64{1: 0, 2: 0}

	worlds := worldSet{startingCounts, startingWinners}
	for i := 0; len(worlds.stateCounts) > 0; i++ {
		worlds = *worlds.next()

		if i%10 == 0 {
			fmt.Println(worlds.winnerCounts)
		}
	}

	fmt.Println(worlds)
	if worlds.winnerCounts[1] > worlds.winnerCounts[2] {
		fmt.Println("winner 1: ", worlds.winnerCounts[1])
	} else {
		fmt.Println("winner 2: ", worlds.winnerCounts[2])
	}
}
