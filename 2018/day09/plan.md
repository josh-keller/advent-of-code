# Day 9

## Problem

- Marbles in a circle (modulo?)
- Ascending numbers from 0
- Current marble
- Each elf places lowest-number remaining marble (iterate)
- New marble is placed between marbles 1 and 2 marbles clockwise of the current marble (to the right, higher number)
    - One marble between current marble and new marble
- If marble is divisible by 23:
  - Marble isn't put down
  - Current player adds that to their score
  - The marble 7 marbles COUNTER-clockwise is REMOVED
  - Current player adds that to their score
  - Marble clockwise from the removed marble is new current marble (to the right, +1 % new_size)


## Examples

Params:
- Number of players: player_ct
- Last marble: last_marble

State:
- Circle: [0]
- curr_idx: 0
- Scores: [0, 0, ... 0] (length: player_ct)

Curr player can be next_marble % num_players

{[0], 0, 1, [0, 0, 0, 0, 0, 0, 0, 0, 0]}
 0 + 2 % 1 = 1
{[0, 1], 1, 2, ...}
 1 + 2 % 2 = 1
{[0, 2, 1], 1, 3, ...}
 1 + 2 % 3 = 0 <-- always add to the end
{[0, 2, 1, 3], 3, 4, ...}
 3 + 

## Data

State:
- Last marble**
- Number of players**

- Circle - list
- Current marble (int - index in circle list)
- Next marble (number)
- Scores - map, players to score
- Current player (int)

## Algorithm

State --> Next State (normal)
1. Place next marble (careful of n == length % length = 0)
2. Set current marble (same)
3. Advance player
4. No changes to score

next_state(%{
    marbles: marbles,
    curr_marble_idx: cmi,
    next_marble: nm,
    curr_player: cp,
    scores: scores}) do
  
end

State --> Next State (when next marble is %23)
1. Add next marble to the current player's score
2. Find idx of marble to remove
3. Remove that marble and add value to current player's score
4. Set current marble (removed idx % new_length)
5. Advance player

State --> Next state (when next_marble > last marble), do: max of scores
