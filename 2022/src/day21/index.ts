import run from "aocrunner"

type Expr = { v1: string, v2: string | number, op: Op}
type Op = '*' | '/' | '+' | '-' | '='
type Lookup = Map<string, number | Expr>

function isOp(op: string): op is Op {
  return ['+', '-', '*', '/'].includes(op)
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const lookup = new Map<string, number | Expr>()
  lines.forEach(line => {
    const matchVal = line.match(/(?<varName>[a-z]{4}): (?<val>\d+)$/)
    if (matchVal?.groups) {
      const {varName, val} = matchVal.groups
      lookup.set(varName, parseInt(val))
      return
    }

    const matchExpr = line.match(/(?<varName>[a-z]{4}): (?<v1>[a-z]{4}) (?<op>[-+/*]) (?<v2>[a-z]{4})$/)
    if (matchExpr?.groups) {
      const {varName, op, v1, v2} = matchExpr.groups
      if (!isOp(op)) { throw new Error("invalid op")}
      lookup.set(varName, {v1, v2, op})
    }
  })

  return lookup
}

const evaluate = (name: string, lookup: Lookup): number => {
  const resolved = lookup.get(name)
  if (!resolved) {
    throw new Error(`variable '${name}' not found`)
  }

  if (typeof resolved === 'number') {
    return resolved
  }

  if (typeof resolved.v2 === 'number') { throw new Error("number in eval")}

  const res1 = evaluate(resolved.v1, lookup)
  const res2 = evaluate(resolved.v2, lookup)

  switch (resolved.op) {
    case '*':
      return res1 * res2
    case '-':
      return res1 - res2
    case '/':
      return res1 / res2
    case '+':
      return res1 + res2
    case '=':
      throw new Error("cannot evaluate with =")
  }
}

const writeInTermsOf = (name: string, term: string, lookup: Lookup): string | number => {
  if (name === term) { return term }

  const resolved = lookup.get(name)
  if (!resolved) {
    throw new Error(`variable '${name}' not found`)
  }

  if (typeof resolved === 'number') {
    return resolved
  }
  if (typeof resolved.v2 === 'number') { throw new Error("number in write")}

  const res1 = writeInTermsOf(resolved.v1, term, lookup)
  const res2 = writeInTermsOf(resolved.v2, term, lookup)

  if (typeof res1 === 'string' || typeof res2 === 'string') {
    return `(${res1} ${resolved.op} ${res2})`
  }

  switch (resolved.op) {
    case '*':
      return res1 * res2
    case '-':
      return res1 - res2
    case '/':
      return res1 / res2
    case '+':
      return res1 + res2
    case '=':
      return `${res1} = ${res2}`
  }
}

// const solveFor = (expr: Expr, term: string, lookup: Lookup): number => {
//   if (expr.op != '=') { throw new Error("cannot solve a non = expression")}
//
//   let num: number
//   let unbounded: string
//   if (typeof expr.v2 === 'number') {
//     num = expr.v2
//     unbounded = expr.v1
//   } else {
//     try {
//       num = evaluate(expr.v2, lookup)
//       unbounded = expr.v1
//     } catch {
//       num = evaluate(expr.v1, lookup)
//       unbounded = expr.v2
//     }
//   }
//
//   while (unbounded !== term) {
//     const nextExpr = lookup.get(unbounded) as Expr
//     const op = invertOp(nextExpr.op)
//     evalNum(op, num1, num2)
//
//   }
//
//   return num
//
// }

// const invertOp = (op: Op): Op => {
//   if (op === '=') { throw new Error("can't invert =")}
//   switch (op) {
//     case '-':
//       return '+'
//     case '+':
//       return '-'
//     case '*':
//       return '/'
//     case '/':
//       return '*'
//   }
// }


const part1 = (rawInput: string) => {
  const lookup = parseInput(rawInput)

  return evaluate('root', lookup)
}

const part2 = (rawInput: string) => {
  const lookup = parseInput(rawInput)
  const rootExpr = lookup.get('root') as Expr
  lookup.set('root', {...rootExpr, op: '='})
  lookup.delete('humn')

  console.log(lookup)
  console.log("root:", writeInTermsOf('root', 'humn', lookup))

  // console.log(rootExpr.v1, ":", writeInTermsOf(rootExpr.v1, 'humn', lookup))
  // console.log(rootExpr.v2, ":", writeInTermsOf(rootExpr.v2, 'humn', lookup))

  return 
}

run({
  part1: {
    tests: [
      {
        input: `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`,
   expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`,
        expected: 301,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
