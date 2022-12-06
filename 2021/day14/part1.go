package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

const N = 10

func main() {
	polymer, pairs := readData("input.txt")

	for n := 1; n <= N; n++ {
		polymer = polymerize(polymer, pairs)
		// if n < 6 {
		// 	fmt.Println(polymer)
		// }
	}

	min, max := minMaxChars(polymer)
	fmt.Println(min, max)
	fmt.Println(max - min)
}

func minMaxChars(s string) (int, int) {
	counts := make(map[rune]int)

	for _, r := range s {
		counts[r] = counts[r] + 1
	}

	// var minChar, maxChar rune
	min := len(s)
	max := 0

	for _, count := range counts {
		if count < min {
			// minChar = char
			min = count
		}

		if count > max {
			// maxChar = char
			max = count
		}
	}

	return min, max
}

func polymerize(plmr string, pairs map[string]string) string {
	var b strings.Builder

	for i := 0; i < len(plmr)-1; i++ {
		b.WriteByte(plmr[i])

		pair := string(plmr[i : i+2])

		char, exists := pairs[pair]

		if exists {
			b.WriteString(char)
		}
	}

	b.WriteByte(plmr[len(plmr)-1])

	return b.String()
}

func readData(filename string) (string, map[string]string) {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	parts := strings.Split(string(dat), "\n\n")
	polymer := parts[0]

	pairs := make(map[string]string)
	re := regexp.MustCompile(`(..) -> (.)`)

	for _, match := range re.FindAllStringSubmatch(parts[1], -1) {
		pairs[match[1]] = match[2]
	}

	return polymer, pairs
}
