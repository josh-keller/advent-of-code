package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"

	mapset "github.com/deckarep/golang-set/v2"
)

type Beacon struct {
	x int
	y int
	z int
}

type Distance [3]int

func MakeBeaconDistanceMap(lob []Beacon, idx int) map[Distance]bool {
	distances := getDistances(lob, idx)
	distanceMap := make(map[Distance]bool)

	for _, distance := range distances {
		distanceMap[distance] = true
	}

	return distanceMap
}

func (b Beacon) Rotate(rotIndex int) Beacon {
	switch rotIndex % 24 {
	case 0:
		return Beacon{b.x, b.y, b.z}
	case 1:
		return Beacon{b.x, b.z, -b.y}
	case 2:
		return Beacon{b.x, -b.y, -b.z}
	case 3:
		return Beacon{b.x, -b.z, b.y}
	case 4:
		return Beacon{b.y, -b.x, b.z}
	case 5:
		return Beacon{b.y, b.z, b.x}
	case 6:
		return Beacon{b.y, b.x, -b.z}
	case 7:
		return Beacon{b.y, -b.z, -b.x}
	case 8:
		return Beacon{-b.x, -b.y, b.z}
	case 9:
		return Beacon{-b.x, -b.z, -b.y}
	case 10:
		return Beacon{-b.x, b.y, -b.z}
	case 11:
		return Beacon{-b.x, b.z, b.y}
	case 12:
		return Beacon{-b.y, b.x, b.z}
	case 13:
		return Beacon{-b.y, -b.z, b.x}
	case 14:
		return Beacon{-b.y, -b.x, -b.z}
	case 15:
		return Beacon{-b.y, b.z, -b.x}
	case 16:
		return Beacon{b.z, b.y, -b.x}
	case 17:
		return Beacon{b.z, b.x, b.y}
	case 18:
		return Beacon{b.z, -b.y, b.x}
	case 19:
		return Beacon{b.z, -b.x, -b.y}
	case 20:
		return Beacon{-b.z, -b.y, -b.x}
	case 21:
		return Beacon{-b.z, -b.x, b.y}
	case 22:
		return Beacon{-b.z, b.y, b.x}
	case 23:
		return Beacon{-b.z, b.x, -b.y}
	}

	panic("Rotate: Ran out of options")
}

func (b Beacon) DistanceTo(other Beacon) Distance {
	return [3]int{other.x - b.x, other.y - b.y, other.z - b.z}
}

type Scanner []Beacon

func readInput(filename string) (map[int]Scanner, error) {
	readFile, err := os.Open(filename)
	defer readFile.Close()
	if err != nil {
		return nil, err
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	s := make(map[int]Scanner)
	sIdx := -1
	var curr_sensor Scanner
	header := regexp.MustCompile(`--- scanner \d+ ---`)

	for fileScanner.Scan() {
		line := fileScanner.Bytes()
		if header.Match(line) {
			sIdx++
			continue
		}

		if len(line) == 0 {
			s[sIdx] = curr_sensor
			curr_sensor = []Beacon{}
			continue
		}

		curr_sensor = append(curr_sensor, readBeacon(string(line)))
	}

	s[sIdx] = curr_sensor

	return s, nil
}

func readBeacon(line string) Beacon {
	strs := strings.Split(line, ",")
	c := make([]int, len(strs))

	for idx, s := range strs {
		i, err := strconv.Atoi(s)
		if err != nil {
			panic(err)
		}

		c[idx] = i
	}

	return Beacon{c[0], c[1], c[2]}
}

func getDistances(bs []Beacon, idx int) []Distance {
	distances := []Distance{}
	beacon := bs[idx]

	for i, other := range bs {
		if i != idx {
			distances = append(distances, beacon.DistanceTo(other))
		}
	}

	sort.Slice(distances, func(i, j int) bool {
		if distances[i][0] == distances[j][0] {
			if distances[i][1] == distances[j][1] {
				return distances[i][2] < distances[j][2]
			} else {
				return distances[i][1] < distances[j][1]
			}
		} else {
			return distances[i][0] < distances[j][0]
		}
	})

	return distances
}

func getAllDistances(bs []Beacon) [][]Distance {
	distances := [][]Distance{}

	for i := range bs {
		distances = append(distances, getDistances(bs, i))
	}

	return distances
}

func MakeScannerInfo(scanner Scanner) map[Beacon](map[Distance]bool) {
	scannerInfo := make(map[Beacon](map[Distance]bool))

	for idx, beacon := range scanner {
		scannerInfo[beacon] = MakeBeaconDistanceMap(scanner, idx)
	}

	return scannerInfo
}

func RotateScanner(s Scanner, i int) Scanner {
	var rotatedScanner Scanner

	for _, beacon := range s {
		rotatedScanner = append(rotatedScanner, beacon.Rotate(i))
	}

	return rotatedScanner
}

func (b Beacon) Offset(offset [3]int) Beacon {
	return Beacon{b.x + offset[0], b.y + offset[1], b.z + offset[2]}
}

func OffsetAll(scanner Scanner, offset [3]int) Scanner {
	var offsetScanner Scanner

	for _, beacon := range scanner {
		offsetScanner = append(offsetScanner, beacon.Offset(offset))
	}

	return offsetScanner
}

func MatchesAtLeast(sInfo1, sInfo2 map[Beacon](map[Distance]bool), target int) (bool, Distance) {
	for b1, dists1 := range sInfo1 {
		for b2, dists2 := range sInfo2 {
			matches := 1 // Give credit matching two beacons that we are starting on
			for dist := range dists1 {
				if dists2[dist] {
					matches++
					if matches >= target {
						return true, b2.DistanceTo(b1)
					}
				}
			}
		}
	}
	// For each b1,distances1 in sInfo1:
	//  - For each b2, distances2:
	//    matches = 0
	//    - Iterate through keys in distances1
	//      - Check if they exist in distances2
	//      - if they do: increment matches
	//      - if matches >= target
	//        - return
	// if we get through all:
	// return false, Distance

	return false, Distance{}
}

func main() {
	scanners, _ := readInput("input.txt")

	toCheck := []Scanner{scanners[0]}
	delete(scanners, 0)
	var rotatedScanner Scanner

	beaconSet := mapset.NewSet(toCheck[0]...)
	scannerSet := mapset.NewSet(Distance{0, 0, 0})

	for len(scanners) > 0 {
		currentScanner := toCheck[0]
		toCheck = toCheck[1:]
		scannerInfo := MakeScannerInfo(currentScanner)
		// Try each scanner
		var toDelete []int

		for testIdx, testScanner := range scanners {
			// Try each rotation
			for i := 0; i < 24; i++ {
				rotatedScanner = RotateScanner(testScanner, i)
				testScannerInfo := MakeScannerInfo(rotatedScanner)
				if match, offset := MatchesAtLeast(scannerInfo, testScannerInfo, 12); match {
					// add the offset rotate beacons to the set of beacons
					offsetBeacons := OffsetAll(rotatedScanner, offset)
					beaconSet = beaconSet.Union(mapset.NewSet(offsetBeacons...))

					// add the offset to the set of scanners (need to figure out which way)
					scannerSet.Add(offset)

					// take testIdx out of scanners
					toDelete = append(toDelete, testIdx)
					// set the rotatedScanner as the new currentScanner
					toCheck = append(toCheck, OffsetAll(rotatedScanner, offset))
					break
				}
			}
		}

		for _, idx := range toDelete {
			delete(scanners, idx)
		}
	}

	fmt.Printf("Total number of beacons: %d", beaconSet.Cardinality())

	fmt.Printf("Largest distance: %d", maxManhattan(scannerSet.ToSlice()))
}

func maxManhattan(slice []Distance) int {
	maxDist := 0

	for i1, s1 := range slice {
		for i2 := i1 + 1; i2 < len(slice); i2++ {
			s2 := slice[i2]
			dist := absDistance(s1, s2)
			if dist > maxDist {
				maxDist = dist
			}
		}
	}

	return maxDist
}

func absDistance(d1, d2 Distance) int {
	dx := int(math.Abs(float64(d1[0] - d2[0])))
	dy := int(math.Abs(float64(d1[1] - d2[1])))
	dz := int(math.Abs(float64(d1[2] - d2[2])))
	return dx + dy + dz
}
