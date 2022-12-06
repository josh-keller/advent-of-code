package main

import (
	"fmt"
	"math/big"
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
		// fmt.Println("*******After Round ", n, "*********")
		polymerize(pairCounts, charCounts, rules)
	}

	min, max := minMaxChars(charCounts)
	fmt.Println(min, max)
	diff := big.NewInt(0)
	fmt.Println(diff.Sub(max, min))
}

func countChars(s string) *map[rune]*big.Int {
	counts := make(map[rune]*big.Int)

	for i := 0; i < len(s); i++ {
		char := rune(s[i])

		if count, exists := counts[char]; !exists {
			counts[char] = big.NewInt(1)
		} else {
			count.Add(count, big.NewInt(1))
			counts[char] = count
		}
	}

	return &counts
}

func countPairs(s string) *map[string]*big.Int {
	pairs := make(map[string]*big.Int)

	for i := 0; i < len(s)-1; i++ {
		pair := string(s[i : i+2])

		if count, exists := pairs[pair]; !exists {
			pairs[pair] = big.NewInt(1)
		} else {
			count.Add(count, big.NewInt(1))
			pairs[pair] = count
		}
	}

	return &pairs
}

func minMaxChars(counts *map[rune]*big.Int) (min *big.Int, max *big.Int) {
	// fmt.Println(counts)

	max = big.NewInt(0)

	for _, count := range *counts {
		// fmt.Println("char: ", string(char), "c: ", count, "min: ", min, "max: ", max)
		if min == nil || count.Cmp(min) == -1 {
			min = count
		}

		if count.Cmp(max) == 1 {
			max = count
		}

	}

	return
}

func polymerize(pairCounts *map[string]*big.Int, charCounts *map[rune]*big.Int, insRules map[string]rune) {
	newPairCounts := make(map[string]*big.Int)

	// fmt.Println("Begin: ", *pairCounts)

	for pair, count := range *pairCounts {
		if newChar, ex := insRules[pair]; ex {
			// fmt.Println(pair, "->", string(newChar))
			np1 := string(pair[0]) + string(newChar)
			np2 := string(newChar) + string(pair[1])

			// fmt.Println("np1: ", np1, newPairCounts[np1])
			// fmt.Println("np2: ", np2, newPairCounts[np2])

			// *** Needs to be refactored:
			if newCount, npex := newPairCounts[np1]; !npex {
				newCount := big.NewInt(0)
				newPairCounts[np1] = newCount.Set(count)
				// fmt.Println("Adding new count for np1(", np1, "): ", newPairCounts[np1])
			} else {
				newCount.Add(newCount, count)
				// fmt.Println("Updating count for np1(", np1, "): ", newCount)
				// newPairCounts[np1] = newCount
			}

			if newCount, npex := newPairCounts[np2]; !npex {
				newCount := big.NewInt(0)
				newPairCounts[np2] = newCount.Set(count)
				// fmt.Println("Adding new count for np2(", np2, "): ", newPairCounts[np2])
			} else {
				// fmt.Println("Updating count for np2(", np2, "), previous: ", newPairCounts[np2], " adding: ", count)
				newCount.Add(newCount, count)
				// fmt.Println("now: ", newPairCounts[np2])
				// newPairCounts[np2] = newCount
			}

			if chrCt, chrex := (*charCounts)[newChar]; !chrex {
				(*charCounts)[newChar] = count
			} else {
				chrCt.Add(chrCt, count)
				// (*charCounts)[newChar] = chrCt
			}
		} else {
			newPairCounts[pair] = (*pairCounts)[pair]
		}
	}
	// fmt.Println("Pair Counts:")
	// for k, v := range newPairCounts {
	// 	fmt.Println(k, ": ", v)
	// }

	// fmt.Println("Char Counts:")
	// for k, v := range *charCounts {
	// 	fmt.Println(string(k), ": ", v)
	// }

	// fmt.Println("-----")

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
