package main

import (
	"fmt"
	"os"
	"strings"
)

type node struct {
	val  rune
	next *node
}

type stack struct {
	head   *node
	length int
}

var pair = map[rune]rune{
	'(': ')',
	'{': '}',
	'[': ']',
	'<': '>',
}

var score = map[rune]int{
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
}

func main() {
	lines := readData("input.txt")
	score := 0

	for _, line := range lines {
		score += calculateLineScore(line)
	}

	fmt.Println(score)
}

func calculateLineScore(line string) int {
	openingBrackets := newStack()
	r := strings.NewReader(line)

	fmt.Println("Reading: ", line)

	for {
		br, _, e := r.ReadRune()

		if e != nil {
			break
		}

		if isOpening(br) {
			openingBrackets.push(br)
		} else {
			opening := openingBrackets.pop()
			if pair[opening] != br {
				return score[br]
			}
		}
	}

	return 0
}

func isOpening(bracket rune) bool {
	for k := range pair {
		if k == bracket {
			return true
		}
	}
	return false
}

func readData(filename string) []string {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	return strings.Split(strings.TrimSpace(string(dat)), "\n")
}

func (s *stack) push(val rune) int {
	n := node{val, s.head}
	s.head = &n
	s.length += 1

	return s.length
}

func (s *stack) pop() rune {
	if s.length == 0 {
		panic("Cannot pop from an empty stack!")
	}

	n := *s.head
	s.head = n.next
	s.length -= 1

	return n.val
}

func newStack() stack {
	return stack{nil, 0}
}

func (s *stack) print() {
	ptr := s.head

	fmt.Print("stack(", s.length, "): [")

	for ptr != nil {
		fmt.Print(ptr.val)
		if ptr.next != nil {
			fmt.Print(" ")
		}

		ptr = ptr.next
	}

	fmt.Println("]")
}
