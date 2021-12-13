package main

import (
	"fmt"
	"os"
	"sort"
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
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
}

func main() {
	lines := readData("input.txt")
	completions := make([][]rune, 0)

	for _, line := range lines {
		comp, corrupt := getCompletion(line)

		if !corrupt {
			completions = append(completions, comp)
		}
	}

	scores := make([]int, len(completions))

	for i, comp := range completions {
		scores[i] = scoreCompletion(comp)
	}

	sort.Slice(scores, func(i, j int) bool { return scores[i] < scores[j] })

	fmt.Println(scores[len(scores)/2])
}

func scoreCompletion(comp []rune) (total int) {
	for _, br := range comp {
		total *= 5
		total += score[br]
	}

	return
}

func getCompletion(line string) ([]rune, bool) {
	openingBrackets := newStack()
	r := strings.NewReader(line)

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
				return nil, true
			}
		}
	}

	comp := make([]rune, openingBrackets.length)

	for i := 0; i < len(comp); i++ {
		open := openingBrackets.pop()
		comp[i] = pair[open]
	}

	return comp, false
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
