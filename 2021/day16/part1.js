const fs = require('fs')

try {
  const data = fs.readFileSync('input-binary.txt', 'utf8').trim()
  const tree = parsePacket(data)

  console.log(totalVersion(tree))

} catch (err) {
  console.error(err)
}

function printPackets(packet) {
  if (packet.packetID === 4) {
    console.log(`v: ${packet.version}, id: ${packet.packetID}, val: ${packet.number}`)
  } else {
    console.log(`v: ${packet.version}, id: ${packet.packetID}`)
    packet.subPackets.forEach(p => {
      printPackets(p)
    })
  }
}

function totalVersion(packet) {
  let total = packet.version

  if (packet.subPackets) {
    total += packet.subPackets.reduce((sum, p) => sum + totalVersion(p), 0)
  }

  return total
}

function parsePacket(data) {
  const version = parseInt(data.slice(0, 3), 2)
  const packetID = parseInt(data.slice(3, 6), 2)

  if (packetID === 4) {
    const {number, bits} = parseLiteral(data.slice(6))

    return {
      version,
      packetID,
      number,
      bits: bits + 6,
    }
  } else {
    const lengthType = parseInt(data.slice(6,7), 2)
    let lengthEnd;
    let subPackets;
    let bits;

    if (lengthType === 0) {
      lengthEnd = 7 + 15
      bits = parseInt(data.slice(7, lengthEnd), 2)
      subPackets = parseSubsByBits(data.slice(lengthEnd), bits)
    } else {
      lengthEnd = 7 + 11;
      const count = parseInt(data.slice(7, lengthEnd), 2)
      subPackets = parseSubsByCount(data.slice(lengthEnd), count)
      bits = subPackets.reduce((sum, p) => sum + p.bits, 0)
    }

    return {
      version,
      packetID,
      subPackets,
      bits: bits + lengthEnd,
    }
  }
}

// return an array of sub-packets
function parseSubsByBits(data, bits) {
  let currBit = 0
  const packets = []

  while (currBit < bits) {
    let packet = parsePacket(data.slice(currBit))
    packets.push(packet)
    currBit += packet.bits
  }
  
  return packets
}

function parseSubsByCount(data, totalPackets) {
  let currBit = 0
  const packets = []

  while (packets.length < totalPackets) {
    let packet = parsePacket(data.slice(currBit))
    packets.push(packet)
    currBit += packet.bits
  }

  return packets
}

function parseLiteral(data) {
  let number = ""
  let i;

  for (i = 0; i < data.length; i += 5) {
    let byte = data.slice(i, i + 5)
    number += byte.slice(1)

    if (byte[0] === "0") {
      break;
    }
  }

  return {
    number: parseInt(number, 2),
    bits: i + 5,
  }
}
