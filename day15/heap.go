package main

type heapNode struct {
	danger int
	loc    coord
}

type minHeap []heapNode

func (h minHeap) root() heapNode {
	return h[0]
}

func (h minHeap) last() heapNode {
	return h[len(h)-1]
}

func leftChildIndex(index int) int {
	return (index * 2) + 1
}

func rightChildIndex(index int) int {
	return (index * 2) + 2
}

func parentIndex(index int) int {
	return (index - 1) / 2
}

func (h minHeap) insert(c coord, danger int) minHeap {
	value := heapNode{danger, c}
	newHeap := append(h, value)
	newNodeIndex := len(newHeap) - 1
	parentIdx := parentIndex(newNodeIndex)

	for newNodeIndex > 0 && newHeap[newNodeIndex].danger < newHeap[parentIdx].danger {
		newHeap[parentIdx], newHeap[newNodeIndex] = newHeap[newNodeIndex], newHeap[parentIdx]

		newNodeIndex = parentIndex(newNodeIndex)
		parentIdx = parentIndex(newNodeIndex)
	}

	return newHeap
}

func (h minHeap) min() heapNode {
	return h[0]
}

func (h minHeap) delete() minHeap {
	h[0] = h[len(h)-1]
	h = h[:len(h)-1]

	trickleNodeIdx := 0

	for h.hasGreaterChild(trickleNodeIdx) {
		largerChildIdx := h.calcLargerChildIdx(trickleNodeIdx)
		h[trickleNodeIdx], h[largerChildIdx] = h[largerChildIdx], h[trickleNodeIdx]

		trickleNodeIdx = largerChildIdx
	}

	return h
}

func (h minHeap) hasGreaterChild(index int) bool {
	lcIndex := leftChildIndex(index)
	rcIndex := rightChildIndex(index)
	isLeftChild := lcIndex < len(h)
	isRightChild := rcIndex < len(h)

	return (isLeftChild && h[lcIndex].danger < h[index].danger) ||
		(isRightChild && h[rcIndex].danger < h[index].danger)
}

func (h minHeap) calcLargerChildIdx(index int) int {
	rcIndex := rightChildIndex(index)
	lcIndex := leftChildIndex(index)

	if rcIndex >= len(h) {
		return lcIndex
	}

	if h[rcIndex].danger < h[lcIndex].danger {
		return rcIndex
	} else {
		return lcIndex
	}
}
