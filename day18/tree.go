package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type node struct {
	val    int
	parent *node
	left   *node
	right  *node
}

func (n *node) toString() (s string) {
	if n.left == nil && n.right == nil {
		return fmt.Sprintf("%d", n.val)
	}

	return "[" + n.left.toString() + "," + n.right.toString() + "]"
}

func newVal(val int) *node {
	return &node{val, nil, nil, nil}
}

func newPair(left, right *node) *node {
	n := node{0, nil, left, right}
	left.parent = &n
	right.parent = &n

	return &n
}

// func (n *node) red() {
// 	reductionLeft := true
// 	i := 0
// 	for reductionLeft {
// 		reductionLeft = n.reduce(1)
// 		i++
// 	}
// }

func (n *node) reduce() {
	for {
		explosion := n.explode(1)
		split := n.split()
		if !explosion && !split {
			break
		}
	}
}

func (n *node) split() bool {
	if n.isLeaf() && n.val < 10 {
		return false
	}

	if n.isLeaf() && n.val >= 10 {
		n.left = newVal(n.val / 2)
		n.left.parent = n
		n.right = newVal((n.val / 2) + (n.val % 2))
		n.right.parent = n
		n.val = 0

		return true
	}

	return n.left.split() || n.right.split()
}

func (n *node) isLeftChild() bool {
	return n.parent != nil && n.parent.left == n
}

func (n *node) isRightChild() bool {
	return n.parent != nil && n.parent.right == n
}

func (n *node) isLeaf() bool {
	if (n.left == nil && n.right != nil) || (n.left != nil && n.right == nil) {
		panic("Malformed tree!")
	}

	return n.left == nil
}

func (n *node) isRoot() bool {
	return n.parent == nil
}

func (n *node) rightSibling() *node {
	if n.parent == nil {
		return nil
	}

	return n.parent.right
}

func (n *node) leftSibling() *node {
	if n.parent == nil {
		return nil
	}

	return n.parent.left
}

func (n *node) explode(depth int) bool {
	if n.isLeaf() {
		return false
	}

	if depth > 4 {
		lVal := n.left.val
		rVal := n.right.val
		n.left = nil
		n.right = nil
		n.val = 0

		if n.isLeftChild() {
			ptr := n.rightSibling()

			for !ptr.isLeaf() {
				ptr = ptr.left
			}

			ptr.val += rVal

			ptr = n.parent

			for ptr != nil {
				if ptr.isRightChild() {
					ptr = ptr.leftSibling()
					break
				}

				ptr = ptr.parent
			}

			if ptr != nil {
				for !ptr.isLeaf() {
					ptr = ptr.right
				}

				ptr.val += lVal
			}
			return true
		}

		if n.isRightChild() {
			ptr := n.leftSibling()

			for !ptr.isLeaf() {
				ptr = ptr.right
			}

			ptr.val += lVal

			ptr = n.parent

			for ptr != nil {
				if ptr.isLeftChild() {
					ptr = ptr.rightSibling()
					break
				}

				ptr = ptr.parent
			}

			if ptr != nil {
				for !ptr.isLeaf() {
					ptr = ptr.left
				}

				ptr.val += rVal
			}
			return true
		}
	}

	lExplode := n.left.explode(depth + 1)
	rExplode := n.right.explode(depth + 1)
	return lExplode || rExplode
}

func (n *node) magnitude() int {
	if n.isLeaf() {
		return n.val
	}

	return 3*n.left.magnitude() + 2*n.right.magnitude()
}

func copy(n, parent *node) *node {
	if n.isLeaf() {
		new := newVal(n.val)
		new.parent = parent
		return new
	}

	lNew := copy(n.left, n)
	rNew := copy(n.right, n)
	lNew.parent = n
	rNew.parent = n
	return newPair(lNew, rNew)
}

func main() {
	numbers := inputData("input.txt")

	// result := numbers[0]

	// for i := 1; i < len(numbers); i++ {
	// 	result = add(result, numbers[i])
	// }

	// fmt.Println(result.toString())
	// fmt.Println(result.magnitude())

	max := 0

	for i := 0; i < len(numbers)-1; i++ {
		for j := i + 1; j < len(numbers); j++ {
			res := add(copy(numbers[i], nil), copy(numbers[j], nil))
			mag := res.magnitude()
			fmt.Println(" ", numbers[i].toString())
			fmt.Println("+", numbers[j].toString())
			fmt.Println("=", res.toString())
			fmt.Println("max: ", max)
			fmt.Println("mag: ", mag)
			fmt.Println("-------")
			if mag > max {
				max = mag
			}

			res = add(copy(numbers[j], nil), copy(numbers[i], nil))
			mag = res.magnitude()
			fmt.Println(" ", numbers[i].toString())
			fmt.Println("+", numbers[j].toString())
			fmt.Println("=", res.toString())
			fmt.Println("mag: ", mag)
			fmt.Println("max: ", max)
			fmt.Println("-------")
			if mag > max {
				max = mag
			}
		}
	}

	fmt.Println(max)
}

func inputData(filename string) []*node {
	file, err := os.Open(filename)
	defer file.Close()
	if err != nil {
		panic(err)
	}

	numbers := make([]*node, 0)

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		numbers = append(numbers, parseTree(scanner.Text()))
	}

	return numbers
}

func add(n1, n2 *node) *node {
	n := newPair(n1, n2)
	n.reduce()
	return n
}

func parseTree(str string) *node {
	reVals := regexp.MustCompile(`^\[(\d+),(\d+)\]$`)
	reLeftVal := regexp.MustCompile(`^\[(\d+),(\[.+\])\]$`)
	reRightVal := regexp.MustCompile(`^\[(\[.+\]),(\d+)\]$`)

	if match := reVals.FindStringSubmatch(str); match != nil {
		lVal, e1 := strconv.Atoi(match[1])

		if e1 != nil {
			panic(e1)
		}

		rVal, e2 := strconv.Atoi(match[2])

		if e2 != nil {
			panic(e2)
		}

		l := newVal(lVal)
		r := newVal(rVal)
		return newPair(l, r)
	}

	if match := reLeftVal.FindStringSubmatch(str); match != nil {
		lVal, e1 := strconv.Atoi(match[1])

		if e1 != nil {
			panic(e1)
		}

		l := newVal(lVal)
		r := parseTree(match[2])
		return newPair(l, r)
	}

	if match := reRightVal.FindStringSubmatch(str); match != nil {
		l := parseTree(match[1])

		rVal, e2 := strconv.Atoi(match[2])

		if e2 != nil {
			panic(e2)
		}

		r := newVal(rVal)

		return newPair(l, r)
	}

	var b strings.Builder
	var match []string

	bracketCount := 0

	for i := 1; i < len(str)-1; i++ {
		char := str[i]

		if char == '[' {
			bracketCount++
		} else if char == ']' {
			bracketCount--
		}

		b.WriteByte(char)

		if bracketCount == 0 {
			match = append(match, b.String())
			for str[i+1] == ',' {
				i++
			}
			b.Reset()
		}
	}

	l := parseTree(match[0])
	r := parseTree(match[1])
	return newPair(l, r)
}
