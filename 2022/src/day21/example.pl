monkey(root) :- monkey(pppw, Y), monkey(sjmn, Z), Y = Z.
monkey(dbpl, X) :- X is 5.
monkey(cczh, X) :- monkey(sllz, Y), monkey(lgvd, Z), X is Y + Z.
monkey(zczc, X) :- X is 2.
monkey(ptdq, X) :- monkey(humn, Y), monkey(dvpt, Z), X is Y - Z.
monkey(dvpt, X) :- X is 3.
monkey(lfqf, X) :- X is 4.
monkey(humn, X) :- humn(X).
monkey(ljgn, X) :- X is 2.
monkey(sjmn, X) :- monkey(drzm, Y), monkey(dbpl, Z), X is Y * Z.
monkey(sllz, X) :- X is 4.
monkey(pppw, X) :- monkey(cczh, Y), monkey(lfqf, Z), X is Y / Z.
monkey(lgvd, X) :- monkey(ljgn, Y), monkey(ptdq, Z), X is Y * Z.
monkey(drzm, X) :- monkey(hmdt, Y), monkey(zczc, Z), X is Y - Z.
monkey(hmdt, X) :- X is 32.
humn(_) :- monkey(root).
