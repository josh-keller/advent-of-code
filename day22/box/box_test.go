package box

import (
	"fmt"
	"testing"
)

type singleSize struct {
	b        Box
	expected int
}

type pairBool struct {
	b, o     Box
	expected bool
}

type intersectionTrip struct {
	b, o     Box
	expected Box
}

var b1 = Box{1, 1, 2, 2, 3, 3}
var b2 = Box{1, 2, 2, 2, 3, 3}
var b8 = Box{3, 4, 2, 3, 3, 4}
var blong = Box{-1, -1, 2, 2, 1, 8}
var bbig = Box{-1, 3, 1, 3, 0, 9}

var addSingles = []singleSize{
	singleSize{b1, 1},
	singleSize{b2, 2},
	singleSize{b8, 8},
	singleSize{blong, 8},
}

func TestSize(t *testing.T) {
	for _, test := range addSingles {
		if output := test.b.Size(); output != test.expected {
			t.Errorf("Output %d not equal to expected %d", output, test.expected)
		}
	}
}

var addIntersectPairs = []pairBool{
	pairBool{b1, b2, true},
	pairBool{b1, b8, false},
	pairBool{b2, b8, false},
	pairBool{b1, bbig, true},
	pairBool{b2, bbig, true},
	pairBool{b8, bbig, true},
}

func TestIntersects(t *testing.T) {
	for _, test := range addIntersectPairs {
		if inter, output := test.b.Intersection(&test.o); output != test.expected {
			t.Errorf("Output %t not equal to expected %t", output, test.expected)
			t.Errorf("%v.Intersection(%v)", test.b, test.o)
		} else {
			fmt.Println(output, inter)
		}
	}
}

type stringBoxPair struct {
	input    string
	expected Box
}

var parseStringPairs = []stringBoxPair{
	stringBoxPair{"x=-24..26,y=-5..40,z=-7..41", Box{-24, 26, -5, 40, -7, 41}},
	stringBoxPair{"x=-45..2,y=-46..2,z=-20..29", Box{-45, 2, -46, 2, -20, 29}},
	stringBoxPair{"x=-8..39,y=-3..44,z=-25..29", Box{-8, 39, -3, 44, -25, 29}},
}

func TestParseBox(t *testing.T) {
	for _, test := range parseStringPairs {
		if output := ParseBox(test.input); output != test.expected {
			t.Errorf("Output %v not equal to expected %v", output, test.expected)
		}
	}
}

// var intersectTrips = []intersectionTrip
// 	pairBool{b1, b2, b1},
// 	pairBool{b1, b8, },
// 	pairBool{b2, b8, false},
// 	pairBool{b1, bbig, true},
// 	pairBool{b2, bbig, true},
// 	pairBool{b8, bbig, true},
// }
