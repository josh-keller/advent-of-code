package stack

import "fmt"

type node struct {
	val  rune
	next *node
}

type stack struct {
	head   *node
	length int
}

func (s *stack) Push(val rune) int {
	n := node{val, s.head}
	s.head = &n
	s.length += 1

	return s.length
}

func (s *stack) Pop() rune {
	if s.length == 0 {
		panic("Cannot pop from an empty stack!")
	}

	n := *s.head
	s.head = n.next
	s.length -= 1

	return n.val
}

func NewStack() stack {
	return stack{nil, 0}
}

func (s *stack) Print() {
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
