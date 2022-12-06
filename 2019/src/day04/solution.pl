number_of_passwords1(N) :-
  passwords1(Ps),
  length(Ps, N).

passwords1(Ps) :-
  findall(X, valid_password1(X), Ps).

valid_password1(P) :-
  between(236491, 713787, P),
  digit_list(P, Ds),
  length(Ds, 6),
  non_descending(Ds),
  consec_repeated(Ds).

digit_list(N, Ds) :-
  number_string(N, S),
  atom_chars(S, Cs),
  maplist(atom_number, Cs, Ds).

non_descending([]).
non_descending([_]).
non_descending([A, B|Cs]) :-
  A =< B,
  non_descending([B|Cs]), !.

consec_repeated([A, A| _]) :- !.
consec_repeated([_| T]) :-
  consec_repeated(T).

number_of_passwords2(N) :-
  passwords2(Ps),
  length(Ps, N).

passwords2(Ps) :-
  findall(X, valid_password2(X), Ps).

valid_password2(P) :-
  between(236491, 713787, P),
  digit_list(P, Ds),
  length(Ds, 6),
  non_descending(Ds),
  two_consec_repeated(Ds).

two_consec_repeated([A, A]) :- !.
two_consec_repeated([A, A, B| _]) :-
  A \= B, !.
two_consec_repeated([A | T]) :-
  consume_while_head(T, A, TrimmedList),
  two_consec_repeated(TrimmedList).

consume_while_head([], _, []).
consume_while_head([H|T], E, [H|T]) :-
  E \= H, !.
consume_while_head([H|T], H, NewList) :-
  consume_while_head(T, H, NewList).
