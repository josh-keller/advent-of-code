# Day 3

- cut
- > 1000 inches on each side (square)
- claim
  - each elf has made one
  - each has an ID
  - single rectangle parallel to edges of fabric

Rectangle:
  - inches between left edge of fabric and left edge of rectangle
  - inches between top and top
  - width
  - length

#123 @ 3,2: 5x4

id = 123
3 inches from left
2 inches from top
5 inches wide
4 inches tall

Claims overlap

How many square inches of fabric are within two or more claims?

Data Structures:
- tuple of id, and two ranges to represent each claim
  { id, horizontal_range, vertical_range }
- squares:
  { x, y }
- covered_squares:
  Map{ {square} => [id] }

Approach:

1. Parse data into claims
2. For each claim, add every square to the covered_squares Map (use update with [id] or [id | ids])
3. Count the number of squares in the Map with ids length > 1
