package main

//
// import (
// 	"bufio"
// 	"fmt"
// 	"os"
// 	"regexp"
// 	"strconv"
// 	"strings"
// )
//
// type Beacon struct {
// 	x int
// 	y int
// 	z int
// }
//
// func (b Beacon) allRotations() []Beacon {
// 	return []Beacon{
// 		{b.x, b.y, b.z},
// 		{b.x, b.z, -b.y},
// 		{b.x, -b.y, -b.z},
// 		{b.x, -b.z, b.y},
//
// 		{b.y, -b.x, b.z},
// 		{b.y, b.z, b.x},
// 		{b.y, b.x, -b.z},
// 		{b.y, -b.z, -b.x},
//
// 		{-b.x, -b.y, b.z},
// 		{-b.x, -b.z, -b.y},
// 		{-b.x, b.y, -b.z},
// 		{-b.x, b.z, b.y},
//
// 		{-b.y, b.x, b.z},
// 		{-b.y, -b.z, b.x},
// 		{-b.y, -b.x, -b.z},
// 		{-b.y, b.z, -b.x},
//
// 		{b.z, b.y, -b.x},
// 		{b.z, b.x, b.y},
// 		{b.z, -b.y, b.x},
// 		{b.z, -b.x, -b.y},
//
// 		{-b.z, -b.y, -b.x},
// 		{-b.z, -b.x, b.y},
// 		{-b.z, b.y, b.x},
// 		{-b.z, b.x, -b.y},
// 	}
// }
//
// func Distance(b1, b2 Beacon) [3]int {
// 	return [3]int{b1.x - b2.x, b1.y - b2.y, b1.z - b2.z}
// }
//
// type sensor []Beacon
//
// func readInput(filename string) ([]sensor, error) {
// 	readFile, err := os.Open(filename)
// 	defer readFile.Close()
// 	if err != nil {
// 		return nil, err
// 	}
//
// 	fileScanner := bufio.NewScanner(readFile)
// 	fileScanner.Split(bufio.ScanLines)
//
// 	var s []sensor
// 	var curr_sensor sensor
// 	header := regexp.MustCompile(`--- scanner \d+ ---`)
//
// 	for fileScanner.Scan() {
// 		line := fileScanner.Bytes()
// 		if header.Match(line) {
// 			continue
// 		}
//
// 		if len(line) == 0 {
// 			s = append(s, curr_sensor)
// 			curr_sensor = []Beacon{}
// 			continue
// 		}
//
// 		curr_sensor = append(curr_sensor, readBeacon(string(line)))
// 	}
//
// 	s = append(s, curr_sensor)
//
// 	return s, nil
// }
//
// func readBeacon(line string) Beacon {
// 	strs := strings.Split(line, ",")
// 	c := make([]int, len(strs))
//
// 	for idx, s := range strs {
// 		i, err := strconv.Atoi(s)
// 		if err != nil {
// 			panic(err)
// 		}
//
// 		c[idx] = i
// 	}
//
// 	return Beacon{c[0], c[1], c[2]}
// }
//
// func main() {
// 	scanners, _ := readInput("example.txt")
// 	fmt.Println(scanners)
// 	fmt.Println()
// 	fmt.Println(scanners[0])
// }
