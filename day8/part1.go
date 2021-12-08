package main

import (
	"fmt"
	"os"
	"strings"
)

type digit struct {
	segments []byte
	length   int
	digit    int
}

type pair struct {
	signal [10]digit
	output [4]digit
}

func main() {
	data := *readData("input.txt")
	sum := 0

	for _, p := range data {
		for _, d := range p.output {
			switch d.digit {
			case 1, 7, 4, 8:
				sum++
			}
		}
	}

	fmt.Println(sum)
}

func makeDigit(input string) *digit {
	var d digit

	d.segments = []byte(input)
	d.length = len(input)
	d.setEasyDigit()

	return &d
}

func (d *digit) setEasyDigit() {
	switch d.length {
	case 2:
		d.digit = 1
	case 3:
		d.digit = 7
	case 4:
		d.digit = 4
	case 7:
		d.digit = 8
	default:
		d.digit = -1
	}
}

func readData(filename string) *[]pair {
	dat, err := os.ReadFile(filename)

	if err != nil {
		panic(err)
	}

	lines := strings.Split(strings.TrimSpace(string(dat)), "\n")
	pairs := make([]pair, len(lines))

	for i, line := range lines {
		rp := strings.Split(strings.TrimSpace(line), "|")
		signalCodes := strings.Split(strings.TrimSpace(rp[0]), " ")

		for s, dc := range signalCodes {
			pairs[i].signal[s] = *makeDigit(dc)
		}

		outputCodes := strings.Split(strings.TrimSpace(rp[1]), " ")
		for o, oc := range outputCodes {
			pairs[i].output[o] = *makeDigit(oc)
		}
	}

	return &pairs
}
