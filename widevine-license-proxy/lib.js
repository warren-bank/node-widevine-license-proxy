const arrayBufferToBase64 = (buffer) => {
  try {
    if (!buffer) throw 0

    if ((buffer instanceof Buffer) || ArrayBuffer.isView(buffer))
      buffer = buffer.buffer

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

module.exports = {
  arrayBufferToBase64,
  base64ToArrayBuffer
}
