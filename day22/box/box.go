package box

import (
	"fmt"
	"regexp"
	"sort"
	"strconv"
)

type Box struct {
	x0, x1, y0, y1, z0, z1 int
}

func btwn(test, beg, end int) bool {
	return test >= beg && test <= end
}

func (b *Box) intersects(o *Box) bool {
	fmt.Println("testing intersection: ", b, o)
	return (btwn(b.x0, o.x0, o.x1) || btwn(b.x1, o.x0, o.x1) || btwn(o.x0, b.x0, b.x1)) &&
		(btwn(b.y0, o.y0, o.y1) || btwn(b.y1, o.y0, o.y1) || btwn(o.y0, b.y0, b.y1)) &&
		(btwn(b.z0, o.z0, o.z1) || btwn(b.z1, o.z0, o.z1) || btwn(o.z0, b.z0, b.z1))
}

func (b *Box) Size() int {
	return (b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1) * (b.z1 - b.z0 + 1)
}

func (b *Box) Intersection(o *Box) (intersection Box, intersects bool) {
	intersects = b.intersects(o)

	if !intersects {
		return
	}

	xs := []int{b.x0, b.x1, o.x0, o.x1}
	ys := []int{b.y0, b.y1, o.y0, o.y1}
	zs := []int{b.z0, b.z1, o.z0, o.z1}

	sort.Ints(xs)
	sort.Ints(ys)
	sort.Ints(zs)

	intersection = Box{xs[1], xs[2], ys[1], ys[2], zs[1], zs[2]}
	return
}

func ParseBox(str string) Box {
	re := regexp.MustCompile(`x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)`)
	matches := re.FindStringSubmatch(str)
	n := make([]int, 6)

	for i := 1; i <= 6; i++ {
		n[i-1], _ = strconv.Atoi(matches[i])
	}

	for i := 0; i < 6; i += 2 {
		if n[i] > n[i+1] {
			n[i], n[i+1] = n[i+1], n[i]
		}
	}

	return Box{n[0], n[1], n[2], n[3], n[4], n[5]}
}

func (b *Box) Slice(axis string, start, end int) (keep *Box, slicedOff []Box) {
	if axis == "x" {
		if end < b.x0 || start > b.x1 {
			keep = nil
			slicedOff = append(slicedOff, *b)
		} else {
			if start < b.x0 {
				start = b.x0
			}
			if end > b.x1 {
				end = b.x1
			}

			keep = &Box{start, end, b.y0, b.y1, b.z0, b.z1}

			if start > b.x0 {
				slicedOff = append(slicedOff, Box{b.x0, start - 1, b.y0, b.y1, b.z0, b.z1})
			}

			if end < b.x1 {
				slicedOff = append(slicedOff, Box{end + 1, b.x1, b.y0, b.y1, b.z0, b.z1})
			}
		}
	} else if axis == "y" {
		if end < b.y0 || start > b.y1 {
			keep = nil
			slicedOff = append(slicedOff, *b)
		} else {
			if start < b.y0 {
				start = b.y0
			}
			if end > b.y1 {
				end = b.y1
			}

			keep = &Box{b.x0, b.x1, start, end, b.z0, b.z1}

			if start > b.y0 {
				slicedOff = append(slicedOff, Box{b.x0, b.x1, b.y0, start - 1, b.z0, b.z1})
			}

			if end < b.y1 {
				slicedOff = append(slicedOff, Box{b.x0, b.x1, end + 1, b.y1, b.z0, b.z1})
			}
		}
	} else if axis == "z" {
		if end < b.z0 || start > b.z1 {
			keep = nil
			slicedOff = append(slicedOff, *b)
		} else {
			if start < b.z0 {
				start = b.z0
			}
			if end > b.z1 {
				end = b.z1
			}

			keep = &Box{b.x0, b.x1, b.y0, b.y1, start, end}

			if start > b.z0 {
				slicedOff = append(slicedOff, Box{b.x0, b.x1, b.y0, b.y1, b.z0, start - 1})
			}

			if end < b.z1 {
				slicedOff = append(slicedOff, Box{b.x0, b.x1, b.y0, b.y1, end + 1, b.z1})
			}
		}
	}

	return
}

func (b *Box) CutUp(o *Box) []Box {
	axes := []string{"x", "y", "z"}
	vals := []int{o.x0, o.x1, o.y0, o.y1, o.z0, o.z1}

	fmt.Println("****cutting up: ", *b, "using: ", *o)
	keep := b
	var off []Box
	sliced := make([]Box, 0)

	for i := 0; i < 3 && keep != nil; i++ {
		keep, off = keep.Slice(axes[i], vals[2*i], vals[(2*i)+1])
		fmt.Println(axes[i], vals[2*i], vals[2*i], ": ", keep, off)
		sliced = append(sliced, off...)
	}

	sliced = append(sliced, *keep)

	return sliced
}
