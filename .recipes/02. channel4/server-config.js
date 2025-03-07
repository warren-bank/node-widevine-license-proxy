const {request} = require('@warren-bank/node-request')

const debug_level = 3 // 0 = silent. 1 = XHR errors. 2 = input and output data. 3 = XHR body.

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
  .then(data => {if (debug_level >= 2) console.log('XHR response:', JSON.stringify(data, null, 2)); return data})
  .then(data => data.license)
  .catch(error => {if ((debug_level >= 1) && error && error.message) console.log('XHR error:', error.message); return null})

const getProxyResponse = async (req, lib) => {
  if (debug_level >= 2) console.log('request input:', JSON.stringify((req.body ? {...req, body: `${req.body.length} bytes`} : req), null, 2))

  let decoded_query = {}
  for (let key of Object.keys(req.query)) {
    try {
      decoded_query[key] = lib.atob(req.query[key])
    }
    catch(e) {}
  }
  if (debug_level >= 2) console.log('query params:', JSON.stringify(decoded_query, null, 2))

  const {
    license_url,
    token,
    video_url
  } = decoded_query

  if (!license_url || !token || !video_url) return null

  // VOD only
  const request_id = decoded_query.request_id
    ? parseInt(decoded_query.request_id, 10)
    : null

  if ((request_id !== null) && isNaN(request_id)) return null

  // VOD or live
  const video_type = decoded_query.video_type
    ? decoded_query.video_type
    : (
        (request_id !== null)
          ? 'ondemand'
          : 'simulcast'
      )

  // garbage collection
  decoded_query = null

  const message = lib.arrayBufferToBase64(req.body)
  if (!message) return null

  const headers = {
    ...(req.headers || {}),
    "origin":       "https://www.channel4.com",
    "referer":      "https://www.channel4.com/",
    "content-type": "application/json"
  }

  const body = {
    token,
    video: {
      type: video_type,
      url:  video_url
    },
    message
  }

  if (request_id !== null)
    body.request_id = request_id

  if (debug_level >= 3) console.log('XHR body:', JSON.stringify(body, null, 2))

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
