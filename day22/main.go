package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"aoc-day22/box"
)

type instruction struct {
	action string
	b      box.Box
}

func main() {
	instructions := readData("input2.txt")
	onBoxes := make([]box.Box, 0)

	for _, inst := range instructions {
		newOnBoxes := make([]box.Box, 0, len(onBoxes))
		// fmt.Println("Adding box: ", inst.b)

		for _, onBox := range onBoxes {
			// fmt.Println("onBox: ", onBox)
			if intersectBox, intersects := onBox.Intersection(&(inst.b)); intersects {
				cutOnBoxes := onBox.CutUp(&(intersectBox))

				// fmt.Println("intersection: ", intersectBox)
				for _, cutOnBox := range cutOnBoxes {
					// fmt.Print("cutOnBox: ", cutOnBox)
					if cutOnBox != intersectBox {
						// fmt.Print("...added!")
						newOnBoxes = append(newOnBoxes, cutOnBox)
					}
					fmt.Println()
				}
			} else {
				// fmt.Println("no intersection: ", intersectBox)
				newOnBoxes = append(newOnBoxes, onBox)
			}
		}
		if inst.action == "on" {
			newOnBoxes = append(newOnBoxes, inst.b)
		}

		onBoxes = newOnBoxes

		size := 0

		for _, box := range onBoxes {
			size += box.Size()
		}

		fmt.Println(size)
	}

	// for _, box := range onBoxes {
	// 	fmt.Println(box)
	// }

}

func readData(filename string) (instructions []instruction) {
	f, err := os.Open(filename)
	defer f.Close()

	if err != nil {
		panic(err)
	}

	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		strs := strings.Split(scanner.Text(), " ")
		inst := instruction{strs[0], box.ParseBox(strs[1])}
		instructions = append(instructions, inst)
	}

	return
}
