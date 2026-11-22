--------------------------- MODULE SpotifyToken ---------------------------
EXTENDS FiniteSets, Integers

CONSTANTS
  Callers,
  SingleFlight

ASSUME Callers # {}
ASSUME SingleFlight \in BOOLEAN

VARIABLES
  pc,
  posting,
  waiters,
  tokenSeq,
  held

vars == <<pc, posting, waiters, tokenSeq, held>>

TypeOK ==
  /\ pc \in [Callers -> {"idle", "waiting", "posting", "using", "done"}]
  /\ posting \subseteq Callers
  /\ waiters \subseteq Callers
  /\ tokenSeq \in Nat
  /\ held \in [Callers -> Nat]

AtMostOneTokenPost == Cardinality(posting) <= 1

Init ==
  /\ pc = [c \in Callers |-> "idle"]
  /\ posting = {}
  /\ waiters = {}
  /\ tokenSeq = 0
  /\ held = [c \in Callers |-> 0]

EnterGetAccessToken(c) ==
  /\ pc[c] = "idle"
  /\ IF SingleFlight /\ posting # {}
     THEN
       /\ pc' = [pc EXCEPT ![c] = "waiting"]
       /\ waiters' = waiters \union {c}
       /\ UNCHANGED <<posting, tokenSeq, held>>
     ELSE
       /\ pc' = [pc EXCEPT ![c] = "posting"]
       /\ posting' = posting \union {c}
       /\ UNCHANGED <<waiters, tokenSeq, held>>

TokenEndpointReturns(c) ==
  /\ pc[c] = "posting"
  /\ posting' = posting \ {c}
  /\ tokenSeq' = tokenSeq + 1
  /\ IF SingleFlight
     THEN
       /\ pc' = [x \in Callers |->
            IF x = c \/ x \in waiters THEN "using" ELSE pc[x]]
       /\ held' = [x \in Callers |->
            IF x = c \/ x \in waiters THEN tokenSeq + 1 ELSE held[x]]
       /\ waiters' = {}
     ELSE
       /\ pc' = [pc EXCEPT ![c] = "using"]
       /\ held' = [held EXCEPT ![c] = tokenSeq + 1]
       /\ UNCHANGED waiters

UseBearer(c) ==
  /\ pc[c] = "using"
  /\ pc' = [pc EXCEPT ![c] = "done"]
  /\ UNCHANGED <<posting, waiters, tokenSeq, held>>

Done ==
  /\ \A c \in Callers : pc[c] = "done"
  /\ UNCHANGED vars

Next ==
  \/ \E c \in Callers : EnterGetAccessToken(c)
  \/ \E c \in Callers : TokenEndpointReturns(c)
  \/ \E c \in Callers : UseBearer(c)
  \/ Done

Spec == Init /\ [][Next]_vars
=============================================================================
