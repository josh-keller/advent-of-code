package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	alg, pic := readData("input.txt")

	dflt := false

	for i := 1; i <= 50; i++ {
		if needsPadding(pic, dflt) {
			pic = padPicture(pic, dflt)
		}

		newPic := make([][]bool, len(pic))

		for i, line := range pic {
			newLine := make([]bool, len(pic[0]))

			for j := range line {
				instAddr := squareToBinary(pic, dflt, i, j)
				newLine[j] = alg[instAddr]
			}

			newPic[i] = newLine
		}

		pic = newPic

		dflt = pic[0][0]
	}

	count := 0

	for _, line := range pic {
		for _, square := range line {
			if square {
				count++
			}
		}
	}

	fmt.Println("Count: ", count)
}

func needsPadding(pic [][]bool, dflt bool) bool {
	length := len(pic)
	width := len(pic[0])
	lines := []int{0, 1, 2, length - 3, length - 2, length - 1}
	cols := []int{0, 1, 2, width - 3, width - 2, width - 1}

	for _, rowIdx := range lines {
		for _, square := range pic[rowIdx] {
			if square != dflt {
				return true
			}
		}
	}

	for i := 3; i < length-3; i++ {
		for _, j := range cols {
			if pic[i][j] != dflt {
				return true
			}
		}
	}

	return false
}

func displayPic(pic [][]bool) {
	for _, line := range pic {
		for _, pixel := range line {
			if pixel {
				fmt.Print("#")
			} else {
				fmt.Print(".")
			}
		}
		fmt.Println()
	}
	fmt.Println()
	fmt.Println()
}

func padPicture(pic [][]bool, dflt bool) [][]bool {
	newWidth := len(pic[0]) + 6
	newHeight := len(pic) + 6
	lrPad := []bool{dflt, dflt, dflt}

	fullLine := make([]bool, newWidth)
	for i := range fullLine {
		fullLine[i] = dflt
	}

	paddedPic := make([][]bool, newHeight)

	for i := 0; i < newHeight; i++ {
		if i < 3 || i >= newHeight-3 {
			cpy := make([]bool, newWidth)
			copy(cpy, fullLine)
			paddedPic[i] = cpy
		} else {
			paddedPic[i] = append(append(lrPad, pic[i-3]...), lrPad...)
		}
	}

	return paddedPic
}

func squareToBinary(pic [][]bool, dflt bool, i, j int) int {
	height := len(pic)
	width := len(pic[0])

	var binary strings.Builder

	for di := -1; di <= 1; di++ {
		ni := i + di

		for dj := -1; dj <= 1; dj++ {
			nj := j + dj
			if ni >= 0 && ni < height && nj >= 0 && nj < width {
				// fmt.Println("(", ni, ",", nj, ")")
				if pic[ni][nj] {
					binary.WriteByte('1')
				} else {
					binary.WriteByte('0')
				}
			} else {
				if dflt {
					binary.WriteByte('1')
				} else {
					binary.WriteByte('0')
				}
			}
		}
	}
	str := binary.String()
	num, err := strconv.ParseInt(str, 2, 32)

	if err != nil {
		panic(err)
	}

	return int(num)
}

func readData(filename string) ([]bool, [][]bool) {
	f, err := os.Open(filename)
	defer f.Close()
	if err != nil {
		panic("Couldn't open file")
	}

	r := bufio.NewReader(f)
	algorithm := make([]bool, 512)
	i := 0

	for {
		b, _ := r.ReadByte()
		if b == byte('\n') {
			p, _ := r.Peek(1)
			if p[0] == byte('\n') {
				r.ReadByte()
				break
			} else {
				continue
			}
		}

		algorithm[i] = b == byte('#')

		i++
	}

	picture := make([][]bool, 0)

	for {
		line, e := r.ReadBytes(byte('\n'))
		if e != nil {
			break
		}

		newLine := make([]bool, len(line)-1)
		for i, char := range line {
			if char == '#' {
				newLine[i] = true
			}
		}

		picture = append(picture, newLine)
	}

	return algorithm, picture
}
