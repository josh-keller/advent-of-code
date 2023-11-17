# Day 2

suit
two similar box IDs
count of boxes with exactly two of any letter
count of boxes with exactly three of any letter

count2 * count3 = checksum


Map each string into a count of letters (map of counts for each letter)
For 2 and 3 see if it appears at least once


- Find the two IDs that have all letters in common except one
- What letters are in common?

Create a Map of strings to strings
For each id:
  For  each letter in the id:
   - Create the id with that letter missing
   - Check the Map for this id with missing letter
     - if found: we have our answer and can return the id with letter missing
     - else:
       - Add it to a hash pointing to the original string (index or actual string)

