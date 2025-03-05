const {request} = require('@warren-bank/node-request')

const debug_level = 2 // 0 = silent. 1 = XHR errors. 2 = input and output data. 3 = base64 license challenge.

const proxyRequest = (url, method = 'POST', headers = null, body = null) => request(
    [url, {
      method,
      headers
    }],
    body,
    {
      binary: false,
      stream: false
    }
  )
  .then(data => JSON.parse(data.response))
  .then(data => {if (debug_level >= 2) console.log('server response:', JSON.stringify(data, null, 2)); return data})
  .then(data => data.license)
  .catch(error => {if ((debug_level >= 1) && error && error.message) console.log(error.message); return null})

const getProxyResponse = async (req, lib) => {
  if (debug_level >= 2) console.log('request input:', JSON.stringify((req.body ? {...req, body: `${req.body.length} bytes`} : req), null, 2))

  let decoded_query = {}
  for (let key of Object.keys(req.query)) {
    try {
      decoded_query[key] = atob(req.query[key])
    }
    catch(e) {}
  }
  if (debug_level >= 2) console.log('query params:', JSON.stringify(decoded_query, null, 2))

  const {
    license_url,
    request_id,
    token,
    video_url,
    video_type
  } = decoded_query
  decoded_query = null

  if (!license_url || !request_id || !token || !video_url) return null

  if (!video_type) video_type = 'ondemand'

  const message = lib.arrayBufferToBase64(req.body)
  if (debug_level >= 3) console.log('encoded message:', message)

  const headers = {
    ...(req.headers || {}),
    "origin":       "https://www.channel4.com",
    "referer":      "https://www.channel4.com/",
    "content-type": "application/json"
  }

  const body = {
    request_id,
    token,
    video: {
      type: video_type,
      url:  video_url
    },
    message
  }

  const license = await proxyRequest(license_url, 'POST', headers, body)

  return lib.base64ToArrayBuffer(license)
}

module.exports = {
  route: '/channel4', // unique path with optional params

  getCertificate: async function(req, lib) {
    // input:
    //   const {method, headers, xhr, secure, protocol, path, params, query, body} = req

    if (debug_level >= 2) console.log('----- certificate request -----')

    return await getProxyResponse(req, lib)

    // output resolves to:
    //   String (in base64 encoding), Buffer, TypedArray, or ArrayBuffer
  },

  getLicense: async function(req, lib) {
    // input:
    //   const {method, headers, xhr, secure, protocol, path, params, query, body} = req

    if (debug_level >= 2) console.log('----- license request -----')

    return await getProxyResponse(req, lib)

    // output resolves to:
    //   String (in base64 encoding), Buffer, TypedArray, or ArrayBuffer
  }
}
