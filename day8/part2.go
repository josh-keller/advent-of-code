package main

import (
	"fmt"
	"os"
	"strings"
	"sort"
)

type digit struct {
	segments []byte
	segStr string
	length   int
	digit    int
	missing []byte
}

type pair struct {
	signal [10]digit
	output [4]digit
	digits map[int]digit
	segMap map[byte]byte
}

func (d digit) has(seg byte) bool {
	return includes(d.segments, seg)
}

func main() {
	data := *readData("input.txt")

	sum := 0

	for _, d := range data {
		d.solve()
		sum += d.decodeOutput()
	}

	fmt.Println(sum)
}

func (p *pair) decodeOutput() int {
	strToDigit := make(map[string]int)
	for val, dig := range p.digits {
		strToDigit[dig.segStr] = val
	}

	output := 0
	multiplier := 1000

	for _, d := range p.output {
		output += multiplier * strToDigit[d.segStr]
		multiplier /= 10
	}

	return output
}

func (p *pair) solve() {
	p.solveA()
	p.solveLen6()
	p.solveLen5()
}

func (p *pair) solveA() {
	one := p.digits[1]
	seven := p.digits[7]

	for _, c := range seven.segments {
		if !one.has(c) {
			p.segMap[c] = byte('a')
			return
		}
	}

	panic("One-seven not working!")

	return
}

func (pr *pair) solveLen6() {
	for i := 0; i < len(pr.signal); i++ {
		if pr.signal[i].length != 6 {
			continue
		}
		missing := pr.signal[i].missing[0]

		switch {
		case !pr.digits[4].has(missing):
			pr.segMap[missing] = byte('e')
			pr.signal[i].digit = 9
			pr.digits[9] = pr.signal[i]
		case pr.digits[1].has(missing):
			pr.segMap[missing] = byte('c')
			pr.signal[i].digit = 6
			pr.digits[6] = pr.signal[i]
		default:
			pr.segMap[missing] = byte('d')
			pr.signal[i].digit = 0
			pr.digits[0] = pr.signal[i]
		}
	}
}

func (pr *pair) solveLen5() {
	for i := 0; i < len(pr.signal); i++ {
		if pr.signal[i].length != 5 {
			continue
		}

		missing := pr.signal[i].missing
		hasE := false
		hasC := false

		for _, b := range pr.signal[i].segments {
			if pr.segMap[b] == byte('e') {
				hasE = true
			}

			if pr.segMap[b] == byte('c') {
				hasC = true
			}
		}

		if hasE {
			pr.signal[i].digit = 2
			pr.digits[2] = pr.signal[i]
			if pr.digits[1].has(missing[0]) {
				pr.segMap[missing[0]] = byte('f')
				pr.segMap[missing[1]] = byte('b')
			} else {
				pr.segMap[missing[1]] = byte('f')
				pr.segMap[missing[0]] = byte('b')
			}
		} else if hasC {
			pr.signal[i].digit = 3
			pr.digits[3] = pr.signal[i]
			if pr.digits[4].has(missing[0]) {
				pr.segMap[missing[0]] = byte('b')
			} else {
				pr.segMap[missing[1]] = byte('b')
			}
		} else {
			pr.signal[i].digit = 5
			pr.digits[5] = pr.signal[i]
		}

	}

	for b := byte(97); b <= byte(103); b++ {
		_, prs := pr.segMap[b]
		if !prs {
			pr.segMap[b] = 'g'
			break
		}
	}
}

func includes(s []byte, query byte) bool {
	for _, c := range s {
		if c == query {
			return true
		}
	}

	return false
}

func makeDigit(input string) *digit {
	var d digit

	d.segments = []byte(input)
	sort.Slice(d.segments, func(i, j int) bool {
				return d.segments[i] < d.segments[j]
	})
	d.segStr = string(d.segments)
	d.length = len(input)
	d.setEasyDigit()
	d.missing = getMissing(d.segments)

	return &d
}

func getMissing(segments []byte) []byte {
	missing := make([]byte, 0, 5)

	for b := byte(97); b <= byte(103); b++ {
		isMissing := true
		for _, seg := range segments {
			if b == seg {
				isMissing = false
				break
			}
		}

		if isMissing {
			missing = append(missing, b)
		}
	}

	return missing
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
		pairs[i].digits = make(map[int]digit)
		pairs[i].segMap = make(map[byte]byte)

		for s, dc := range signalCodes {
			pairs[i].signal[s] = *makeDigit(dc)
			digit := pairs[i].signal[s].digit

			if (digit != -1) {
				pairs[i].digits[digit] = pairs[i].signal[s]
			}
		}

		outputCodes := strings.Split(strings.TrimSpace(rp[1]), " ")
		for o, oc := range outputCodes {
			pairs[i].output[o] = *makeDigit(oc)
		}
	}

	return &pairs
}
