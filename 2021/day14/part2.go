package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

const N = 40

func main() {
	polymer, rules := readData("input.txt")
	fmt.Println(rules)

	pairCounts := countPairs(polymer)
	charCounts := countChars(polymer)

	for n := 1; n <= N; n++ {
		polymerize(pairCounts, charCounts, rules)
	}

	min, max := minMaxChars(charCounts)
	fmt.Println(min, max)
	fmt.Println(max - min)
}

func countChars(s string) *map[rune]uint64 {
	counts := make(map[rune]uint64)

	for i := 0; i < len(s); i++ {
		char := rune(s[i])

		counts[char] = counts[char] + 1
	}

	return &counts
}

func countPairs(s string) *map[string]uint64 {
	pairs := make(map[string]uint64)

	for i := 0; i < len(s)-1; i++ {
		pair := string(s[i : i+2])
		pairs[pair] = pairs[pair] + 1
	}

	return &pairs
}

func minMaxChars(counts *map[rune]uint64) (min uint64, max uint64) {
	min = ^uint64(0)

	for _, count := range *counts {
		if count < min{
			min = count
		}

		if count > max {
			max = count
		}
	}

	return
}

func polymerize(pairCounts *map[string]uint64, charCounts *map[rune]uint64, insRules map[string]rune) {
	newPairCounts := make(map[string]uint64)

	for pair, count := range *pairCounts {
		if newChar, ex := insRules[pair]; ex {
			np1 := string(pair[0]) + string(newChar)
			np2 := string(newChar) + string(pair[1])

			newPairCounts[np1] = newPairCounts[np1] + count
			newPairCounts[np2] = newPairCounts[np2] + count

			(*charCounts)[newChar] = (*charCounts)[newChar] + count
		} else {
			newPairCounts[pair] = (*pairCounts)[pair]
		}
	}

	*pairCounts = newPairCounts
}

func readData(filename string) (string, map[string]rune) {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	parts := strings.Split(string(dat), "\n\n")
	polymer := parts[0]

	pairs := make(map[string]rune)
	re := regexp.MustCompile(`(..) -> (.)`)

	for _, match := range re.FindAllStringSubmatch(parts[1], -1) {
		pairs[match[1]] = rune(match[2][0])
	}

	return polymer, pairs
}
