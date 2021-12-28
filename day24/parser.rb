# def largest_digits(z, d_idx)
#   9.downto 1 do |digit|
#     if d_idx < 6
#       puts " " * d_idx + "#{digit}"
#     end
#     next_z = calc(digit, z, d_idx)
#     if d_idx == 13 && next_z == 0
#       return [digit]
#     elsif d_idx == 13 && next_z != 0
#       next
#     else
#       next_digits = largest_digits(next_z, d_idx + 1)
#       if next_digits
#         return [digit] + next_digits
#       end
#     end
#   end

#   return false
# end

@args = [
  [1, 12, 15],
  [1, 14, 12],
  [1, 11, 15],
  [26, -9, 12],
  [26, -7, 15],
  [1, 11, 2],
  [26, -1, 11],
  [26, -16, 15],
  [1, 11, 10],
  [26, -15, 2],
  [1, 10, 0],
  [1, 12, 0],
  [26, -4, 15],
  [26, 0, 15]
]

def calc(w, z, i)
  @memo = @memo || {}
  key = "#{w},#{z},#{i}"
  if @memo.has_key?(key)
    return @memo[key]
  end

  a = @args[i][0]
  b = @args[i][1]
  c = @args[i][2]

  x = 0
  x += z
  x %= 26
  z /= a
  x += b

  x = (x == w) ? 1 : 0
  x = (x == 0) ? 1 : 0

  y = 0
  y += 25
  y *= x
  y += 1
  z *= y

  y = 0
  y += w
  y += c
  y *= x
  z += y

  @memo[key] = z

  return z
end

digits = [9, 4, 3, 9, 9, 8, 9, 8, 9, 4, 9, 9, 5, 9]

z = 0

digits.each_with_index do |digit, index|
  puts "#{index + 1} - z: #{z}, digit: #{digit}, #{@args[index]}"
  z = calc(digit, z, index)
  # puts z
  puts "#{z.to_s(26)}"
end
