package main

import (
	"fmt"
	"reflect"
	"testing"
)

func TestAllRotations(t *testing.T) {
	b := Beacon{5, 6, -4}
	want := []Beacon{
		{5, 6, -4}, {5, -4, -6}, {5, -6, 4}, {5, 4, 6},
		{6, -5, -4}, {6, -4, 5}, {6, 5, 4}, {6, 4, -5},
		{-5, -6, -4}, {-5, 4, -6}, {-5, 6, 4}, {-5, -4, 6},
		{-6, 5, -4}, {-6, 4, 5}, {-6, -5, 4}, {-6, -4, -5},
		{-4, 6, -5}, {-4, 5, 6}, {-4, -6, 5}, {-4, -5, -6},
		{4, -6, -5}, {4, -5, 6}, {4, 6, 5}, {4, 5, -6},
	}

	got := make([]Beacon, 24)

	for i := 0; i < 24; i++ {
		got[i] = b.Rotate(i)
	}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("got %v", got)
		t.Errorf("want %v", want)
	}
}

func TestDistance(t *testing.T) {
	cases := []struct {
		Start Beacon
		End   Beacon
		Want  Distance
	}{
		{Beacon{0, 1, 2}, Beacon{2, 2, 2}, Distance{2, 1, 0}},
		{Beacon{0, 0, 0}, Beacon{2, 2, 2}, Distance{2, 2, 2}},
		{Beacon{2, 2, 2}, Beacon{0, 0, 0}, Distance{-2, -2, -2}},
	}

	for i, test := range cases {
		t.Run(fmt.Sprintf("Test #%d", i), func(t *testing.T) {
			got := test.Start.DistanceTo(test.End)

			if !reflect.DeepEqual(got, test.Want) {
				t.Errorf("got %v, want %v", got, test.Want)
			}
		})
	}
}

func TestMakeBeaconInfo(t *testing.T) {
	beacons := []Beacon{
		{0, 0, 0},
		{1, 1, 1},
		{-1, 2, 3},
		{4, -5, -6},
	}

	got := MakeBeaconDistanceMap(beacons, 0)
	want := map[Distance]bool{
		{1, 1, 1}:   true,
		{-1, 2, 3}:  true,
		{4, -5, -6}: true,
	}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("got: %v, want: %v", got, want)
	}
}

func TestMakeScannerInfo(t *testing.T) {
	scanner := []Beacon{
		{0, 0, 0},
		{1, 1, 1},
		{-1, 2, 3},
		{4, -5, -6},
	}

	want := map[Beacon](map[Distance]bool){
		{0, 0, 0}:   {{1, 1, 1}: true, {-1, 2, 3}: true, {4, -5, -6}: true},
		{1, 1, 1}:   {{-1, -1, -1}: true, {-2, 1, 2}: true, {3, -6, -7}: true},
		{-1, 2, 3}:  {{1, -2, -3}: true, {2, -1, -2}: true, {5, -7, -9}: true},
		{4, -5, -6}: {{-4, 5, 6}: true, {-3, 6, 7}: true, {-5, 7, 9}: true},
	}

	got := MakeScannerInfo(scanner)

	if !reflect.DeepEqual(got, want) {
		t.Errorf("got:  %v", got)
		t.Errorf("want: %v", want)
	}
}

func TestOffsetAll(t *testing.T) {
	scanner := Scanner{
		{0, 0, 0},
		{1, 1, 1},
		{-1, 2, 3},
		{4, -5, -6},
	}
	offset := Distance{2, 2, 2}

	want := Scanner{
		{2, 2, 2},
		{3, 3, 3},
		{1, 4, 5},
		{6, -3, -4},
	}

	got := OffsetAll(scanner, offset)

	if !reflect.DeepEqual(got, want) {
		t.Errorf("got:  %v", got)
		t.Errorf("want: %v", want)
	}
}

func TestOffset(t *testing.T) {
	cases := []struct {
		Initial Beacon
		Offset  [3]int
		Result  Beacon
	}{
		{Beacon{0, 1, 2}, Distance{2, 1, 0}, Beacon{2, 2, 2}},
		{Beacon{0, 0, 0}, Distance{2, 2, 2}, Beacon{2, 2, 2}},
		{Beacon{2, 2, 2}, Distance{-2, -2, -2}, Beacon{0, 0, 0}},
	}

	for i, test := range cases {
		t.Run(fmt.Sprintf("Test #%d", i), func(t *testing.T) {
			got := test.Initial.Offset(test.Offset)

			if !reflect.DeepEqual(got, test.Result) {
				t.Errorf("got %v, want %v", got, test.Result)
			}
		})
	}
}

func TestMatchesAtLeast(t *testing.T) {
	offset := [3]int{1, 1, 1}

	scanner1 := []Beacon{
		{0, 0, 0},
		{1, 1, 1},
		{-1, 2, 3},
		{4, -5, -6},
	}

	scanner2 := []Beacon{
		{1, 1, 1},
		{2, 2, 2},
		{0, 3, 4},
		{5, 5, 5},
	}

	offsetScanner := OffsetAll(scanner1, offset)
	sInfo1 := MakeScannerInfo(scanner1)
	offsetInfo := MakeScannerInfo(offsetScanner)
	sInfo2 := MakeScannerInfo(scanner2)

	matches, gotOffset := MatchesAtLeast(sInfo1, offsetInfo, 4)

	if !matches {
		t.Errorf("Should match, but does not")
	} else if offset != gotOffset {
		t.Errorf("Got offset: %v, want offset: %v", gotOffset, offset)
	}

	matches, gotOffset = MatchesAtLeast(sInfo1, sInfo2, 3)

	if !matches {
		t.Errorf("Should match, but does not")
	} else if offset != gotOffset {
		t.Errorf("Got offset: %v, want offset: %v", gotOffset, offset)
	}

	matches, gotOffset = MatchesAtLeast(sInfo1, sInfo2, 4)

	if matches {
		t.Errorf("Should not match, but does")
	}

}
