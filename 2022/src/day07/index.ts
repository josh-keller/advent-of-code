import run from "aocrunner"

const TOTAL_SPACE = 70000000
const NEEDED_SPACE = 30000000

class FSObject {
  name: string
  parent: FSObject | null

  constructor(name: string, parent: FSObject | null) {
    this.name = name
    this.parent = parent
  }
}

class File extends FSObject {
  size: number

  constructor(name: string, parent: FSObject | null, size: number) {
    super(name, parent)
    this.size = size
  }
}

class Directory extends FSObject {
  children: { [name: string]: FSObject } = {}
}

const parseInput = (rawInput: string): FSObject => {
  const lines = rawInput.split("\n")

  const root = new Directory("/", null)
  let current = root

  for (let i = 1; i < lines.length; i++) {
    switch (lines[i].slice(0, 4)) {
      case "$ ls":
        break
      case "$ cd":
        if (lines[i].slice(5, 7) === "..") {
          current = current.parent as Directory
        } else {
          const dirName = lines[i].slice(5)
          current = current.children[dirName] as Directory
        }
        break
      default:
        if (lines[i].slice(0, 3) === "dir") {
          const dirName = lines[i].slice(4)
          current.children[dirName] = new Directory(dirName, current)
        } else {
          const [size, fileName] = lines[i].split(" ")
          current.children[fileName] = new File(fileName, current, Number(size))
        }
        break
    }
  }

  return root
}

function dirSizesUnder(dir: Directory, memo: { "total": number }): number {
  let size = 0

  Object.values(dir.children).forEach(obj => {
    if (obj instanceof Directory) {
      size += dirSizesUnder(obj, memo)
    } else if (obj instanceof File) {
      size += obj.size
    }
  })

  if (size <= 100000) {
    memo.total += size
  }
  
  return size
}

function smallestDirDel(dir: Directory, minSize: number, memo: { "minSize": number }): number {
  let size = 0

  Object.values(dir.children).forEach(obj => {
    if (obj instanceof Directory) {
      size += smallestDirDel(obj, minSize, memo)
    } else if (obj instanceof File) {
      size += obj.size
    }
  })

  if (size >= minSize && (size < memo.minSize || memo.minSize === 0)) {
    memo.minSize = size
  }

  return size
}

const part1 = (rawInput: string) => {
  const fs = parseInput(rawInput) as Directory

  const memo = { total: 0 }
  dirSizesUnder(fs, memo)

  return memo.total
}

const part2 = (rawInput: string) => {
  const fs = parseInput(rawInput) as Directory
  const memo = { total: 0 }
  const usedSpace = dirSizesUnder(fs, memo)
  const unusedSpace = TOTAL_SPACE - usedSpace
  const minToDelete = NEEDED_SPACE - unusedSpace
  console.log("Used space:", usedSpace)
  console.log("Unused space:", unusedSpace)
  console.log("Min to delete:", minToDelete)
  
  const delMemo = { "minSize": 0 }
  
  smallestDirDel(fs, minToDelete, delMemo)
  return delMemo.minSize
}

run({
  part1: {
    tests: [
      {
        input: `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
       `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
       `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
