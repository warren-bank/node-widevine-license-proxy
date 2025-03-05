const arrayBufferToBase64 = (buffer) => {
  try {
    if (!buffer) throw 0

    if (buffer instanceof Buffer)
      buffer = nodeBufferToArrayBuffer(buffer)

    if (ArrayBuffer.isView(buffer))
      buffer = buffer.buffer

    if (!(buffer instanceof ArrayBuffer)) throw 0

    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i=0; i < len; i++) {
      binary += String.fromCharCode( bytes[i] )
    }
    return btoa(binary)
  }
  catch(e) {
    return null
  }
}

const base64ToArrayBuffer = (base64) => {
  try {
    if (!base64 || (typeof base64 !== 'string')) throw 0

    const binary_string = atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i=0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
  }
  catch(e) {
    return null
  }
}

const nodeBufferToArrayBuffer = (buffer) => {
  try {
    if (!buffer) throw 0

    if (!(buffer instanceof Buffer)) {
      if (ArrayBuffer.isView(buffer))
        buffer = buffer.buffer

      if (buffer instanceof ArrayBuffer)
        return buffer

      throw 0
    }

    const arrayBuffer = new ArrayBuffer(buffer.length)
    const bytes = new Uint8Array(arrayBuffer)
    for (let i=0; i < buffer.length; i++) {
      bytes[i] = buffer[i]
    }
    return arrayBuffer
  }
  catch(e) {
    return null
  }
}

const arrayBufferToNodeBuffer = (buffer) => {
  try {
    if (!buffer) throw 0

    if (buffer instanceof Buffer)
      return buffer

    if (ArrayBuffer.isView(buffer))
      buffer = buffer.buffer

    if (!(buffer instanceof ArrayBuffer)) throw 0

    const nodeBuffer = Buffer.alloc(buffer.byteLength)
    const bytes = new Uint8Array(buffer)
    for (let i=0; i < nodeBuffer.length; ++i) {
      nodeBuffer[i] = bytes[i]
    }
    return nodeBuffer
  }
  catch(e) {
    return null
  }
}

module.exports = {
  arrayBufferToBase64,
  base64ToArrayBuffer
}
