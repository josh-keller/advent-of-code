#!/bin/bash

[[ -f '../.session' ]] || exit 1
[[ $1 -gt 0 ]] && [[ $1 -lt 26 ]] || exit 1

# Create directory if not there already
dir=$(printf 'day%02d' "$1")
mkdir -p $dir

# Copy template
[[ -f $dir/solution.py ]] || cp ./template.py $dir/solution.py

# Download input
if ! [[ -f $dir/input ]]; then
  curl "https://adventofcode.com/2017/day/$1/input" -H "cookie: session=$(cat ../.session)" -o $dir/input
fi

cd $dir

echo solution.py | entr -c python3 solution.py input
