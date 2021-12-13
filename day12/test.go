package main

import "fmt"

func alter(s []int) {
	s[1] = 45
}

func main() {
	s1 := []int{1, 2, 3}
	s2 := make([]int, len(s1))
	copy(s2, s1)
	alter(s2)
	fmt.Println(s1)
	fmt.Println(s2)
}
