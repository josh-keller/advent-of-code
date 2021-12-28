package main

import "fmt"

type hallSquare struct {
	left    *hallSquare
	right   *hallSquare
	rm      *room
	amphi   string
	canStop bool
}

type room struct {
	amphis []string
	state  string
	name   string
	exit   *hallSquare
}

type board struct {
	leftEnd  *hallSquare
	rightEnd *hallSquare
	rooms    map[string]*room
	score    int
}

type moveOut struct {
	sourceRoom string
	index      int
	dest       *hallSquare
	moves      int
}

type moveIn struct {
	sourceSquare *hallSquare
	destRoom     string
	destIdx      int
	moves        int
}

var multiplier = map[string]int{
	"A": 1,
	"B": 10,
	"C": 100,
	"D": 1000,
}

const winner = `#############
#...........#
###A#B#C#D###
###A#B#C#D###
###A#B#C#D###
###A#B#C#D###
#############`

func main() {
	brd := makeBoard()
	fmt.Print(brd)

	score, _, moveHistory := makeBestMove(brd)
	for i := len(moveHistory) - 1; i >= 0; i-- {
		fmt.Println(moveHistory[i])
	}
	fmt.Println(score)

	// moves := brd.rooms["A"].movesOut()

	// brd = brd.makeMoveOut(moves[0])
	// fmt.Print(brd)

	// moves = brd.rooms["B"].movesOut()
	// brd = brd.makeMoveOut(moves[3])
	// fmt.Print(brd)
}

func (b *board) isWinner() bool {
	for _, name := range []string{"A", "B", "C", "D"} {
		currRoom := b.rooms[name]
		for _, amphi := range currRoom.amphis {
			if amphi != currRoom.name {
				return false
			}
		}
	}

	// fmt.Println("WINNER!")
	// fmt.Println(b)

	return true
}

func makeBestMove(brd board) (int, bool, []board) {
	movesIn := allMovesIn(brd)

	for len(movesIn) > 0 {
		brd = brd.makeMoveIn(movesIn[0])
		movesIn = allMovesIn(brd)
	}

	if brd.isWinner() {
		return brd.score, true, []board{brd}
	}

	nextBoards := make([]board, 0)

	for _, move := range allMovesOut(brd) {
		nextBoards = append(nextBoards, brd.makeMoveOut(move))
	}

	if len(nextBoards) == 0 {
		return 0, false, make([]board, 0)
	}

	maxInt := int(^uint(0) >> 1)
	lowestScore := maxInt
	lowestIdx := -1
	var moveHistory []board

	for idx, nextBoard := range nextBoards {
		score, winner, moves := makeBestMove(nextBoard)
		if winner && score < lowestScore {
			lowestScore = score
			lowestIdx = idx
			moveHistory = moves
		}
	}

	if lowestScore == maxInt {
		return 0, false, make([]board, 0)
	} else {
		return lowestScore, true, append(moveHistory, nextBoards[lowestIdx])
	}
}

func allMovesOut(brd board) []moveOut {
	movesOut := brd.rooms["A"].movesOut()
	movesOut = append(movesOut, brd.rooms["B"].movesOut()...)
	movesOut = append(movesOut, brd.rooms["C"].movesOut()...)
	movesOut = append(movesOut, brd.rooms["D"].movesOut()...)

	return movesOut
}

func allMovesIn(brd board) []moveIn {
	movesIn := brd.rooms["A"].movesIn()
	movesIn = append(movesIn, brd.rooms["B"].movesIn()...)
	movesIn = append(movesIn, brd.rooms["C"].movesIn()...)
	movesIn = append(movesIn, brd.rooms["D"].movesIn()...)

	return movesIn
}

func (b *board) makeMoveIn(move moveIn) board {
	newBoard := copyBoard(b)
	newSource := findMatchingSquare(b, &newBoard, move.sourceSquare)
	amphi := newSource.amphi

	(*(newBoard.rooms[move.destRoom])).amphis[move.destIdx] = amphi
	newSource.amphi = ""

	if move.destIdx == 0 {
		newBoard.rooms[move.destRoom].state = "full"
	}

	newBoard.score += move.moves * multiplier[amphi]

	return newBoard
}

func (r *room) movesIn() (result []moveIn) {
	result = make([]moveIn, 0)

	if r.state == "full" || r.state == "closed" {
		return
	}

	topAmphi := 0

	for topAmphi < len(r.amphis) && r.amphis[topAmphi] == "" {
		topAmphi++
	}

	topAmphi--

	entryMoves := topAmphi + 1
	totalMoves := entryMoves
	curr := r.exit

	for curr != nil && curr.amphi == "" {
		curr = curr.right
		totalMoves++
	}

	if curr != nil && curr.amphi == r.name {
		result = append(result, moveIn{curr, r.name, topAmphi, totalMoves})
	}

	totalMoves = entryMoves
	curr = r.exit

	for curr != nil && curr.amphi == "" {
		curr = curr.left
		totalMoves++
	}

	if curr != nil && curr.amphi == r.name {
		result = append(result, moveIn{curr, r.name, topAmphi, totalMoves})
	}

	return
}

func findMatchingSquare(oldBoard *board, newBoard *board, dest *hallSquare) *hallSquare {
	oldPtr := oldBoard.leftEnd
	newPtr := newBoard.leftEnd

	oldVisited := make([]*hallSquare, 0)
	for oldPtr != dest {
		oldVisited = append(oldVisited, oldPtr)
		if oldPtr == nil {
			fmt.Println(oldBoard)
			fmt.Println(newBoard)
			fmt.Println(oldVisited)
			fmt.Println(dest)

			panic("Find matching square:  nil ptr")
		}

		oldPtr = oldPtr.right
		newPtr = newPtr.right
	}

	return newPtr
}

func (b *board) makeMoveOut(move moveOut) board {
	newBoard := copyBoard(b)

	newDest := findMatchingSquare(b, &newBoard, move.dest)

	amphi := b.rooms[move.sourceRoom].amphis[move.index]

	newDest.amphi = amphi
	newBoard.rooms[move.sourceRoom].amphis[move.index] = ""

	open := true

	for i := 0; i < 4; i++ {
		currAmphi := newBoard.rooms[move.sourceRoom].amphis[i]

		if currAmphi == "" {
			continue
		}

		if currAmphi != newBoard.rooms[move.sourceRoom].name {
			open = false
			break
		}
	}

	if open {
		newBoard.rooms[move.sourceRoom].state = "open"
	}

	newBoard.score += move.moves * multiplier[amphi]

	return newBoard
}

func (r *room) movesOut() (result []moveOut) {
	result = make([]moveOut, 0)

	if r.state == "open" || r.state == "full" {
		return
	}

	topAmphi := 0

	for topAmphi < len(r.amphis) && r.amphis[topAmphi] == "" {
		topAmphi++
	}

	if topAmphi == len(r.amphis) {
		return
	}

	exitMoves := topAmphi + 1

	totalMoves := exitMoves
	curr := r.exit

	for curr != nil && curr.amphi == "" {
		if curr.canStop {
			result = append(result, moveOut{r.name, topAmphi, curr, totalMoves})
		}

		curr = curr.left
		totalMoves += 1
	}

	totalMoves = exitMoves
	curr = r.exit

	for curr != nil && curr.amphi == "" {
		if curr.canStop {
			result = append(result, moveOut{r.name, topAmphi, curr, totalMoves})
		}

		curr = curr.right
		totalMoves += 1
	}

	return
}

func makeRoom(name, a0, a1, a2, a3 string) (r room) {
	r = room{
		amphis: []string{a0, a1, a2, a3},
		state:  "closed",
		name:   name,
		exit:   nil,
	}

	r.exit = &hallSquare{rm: &r}
	return r
}

func copyRoom(r room) room {
	cp := make([]string, 4)
	copy(cp, r.amphis)

	newRoom := room{
		amphis: cp,
		state:  r.state,
		name:   r.name,
		exit:   nil,
	}

	newRoom.exit = &hallSquare{
		rm:    &newRoom,
		amphi: r.exit.amphi,
	}

	return newRoom
}

func copyBoard(brd *board) board {
	a := copyRoom(*brd.rooms["A"])
	b := copyRoom(*brd.rooms["B"])
	c := copyRoom(*brd.rooms["C"])
	d := copyRoom(*brd.rooms["D"])

	le := &hallSquare{nil, nil, nil, "", true}
	lw := &hallSquare{le, a.exit, nil, "", true}
	le.right = lw

	a.exit.left = lw
	a.exit.right = &hallSquare{left: a.exit, right: b.exit, canStop: true}
	b.exit.left = a.exit.right
	b.exit.right = &hallSquare{left: b.exit, right: c.exit, canStop: true}
	c.exit.left = b.exit.right
	c.exit.right = &hallSquare{left: c.exit, right: d.exit, canStop: true}
	d.exit.left = c.exit.right
	rw := &hallSquare{d.exit.right, nil, nil, "", true}
	d.exit.right = rw
	re := &hallSquare{rw, nil, nil, "", true}
	rw.right = re

	src := brd.leftEnd
	dst := le

	for src != nil {
		dst.amphi = src.amphi
		src = src.right
		dst = dst.right
	}

	return board{le, re, map[string]*room{"A": &a, "B": &b, "C": &c, "D": &d}, brd.score}
}

func makeBoard() board {
	a := makeRoom("A", "C", "D", "D", "B")
	b := makeRoom("B", "B", "C", "B", "C")
	c := makeRoom("C", "D", "B", "A", "A")
	d := makeRoom("D", "D", "A", "C", "A")

	le := &hallSquare{nil, nil, nil, "", true}
	lw := &hallSquare{le, a.exit, nil, "", true}
	le.right = lw

	a.exit.left = lw
	a.exit.right = &hallSquare{left: a.exit, right: b.exit, canStop: true}
	b.exit.left = a.exit.right
	b.exit.right = &hallSquare{left: b.exit, right: c.exit, canStop: true}
	c.exit.left = b.exit.right
	c.exit.right = &hallSquare{left: c.exit, right: d.exit, canStop: true}
	d.exit.left = c.exit.right
	rw := &hallSquare{d.exit.right, nil, nil, "", true}
	d.exit.right = rw
	re := &hallSquare{rw, nil, nil, "", true}
	rw.right = re

	return board{le, re, map[string]*room{"A": &a, "B": &b, "C": &c, "D": &d}, 0}
}

func (sq *hallSquare) String() string {
	if sq.amphi == "" {
		return "."
	} else {
		return sq.amphi
	}
}

func (b board) String() (result string) {
	result += "#############\n"
	result += "#"
	curr := b.leftEnd
	for curr != nil {
		result += fmt.Sprint(curr)
		curr = curr.right
	}
	result += "#\n"

	for i := 0; i < 4; i++ {
		result += "###"

		roomNames := []string{"A", "B", "C", "D"}

		for _, roomName := range roomNames {
			if am := b.rooms[roomName].amphis[i]; am == "" {
				result += "."
			} else {
				result += am
			}

			result += "#"
		}

		result += "##\n"
	}

	result += "#############\n"
	result += fmt.Sprintf("Energy: %d\n\n", b.score)
	return result
}
