const {request} = require('@warren-bank/node-request')

const debug_level = 2 // 0 = silent. 1 = XHR errors. 2 = input and output data.

const urls = {
  certificate: "https://cwip-shaka-proxy.appspot.com/service-cert",
  license:     "https://cwip-shaka-proxy.appspot.com/no_auth"
}

const proxyRequest = (url, method = 'POST', headers = null, body = null) => request(
    [url, {
      method,
      headers
    }],
    body,
    {
      binary: true,
      stream: false
    }
  )
  .then(data => Buffer.from(data.response))
  .catch(error => {if ((debug_level >= 1) && error && error.message) console.log(error.message); return null})

module.exports = {
  route: '/shaka-player', // unique path with optional params

  getCertificate: async function(req) {
    // input:
    //   const {method, headers, xhr, secure, protocol, path, params, query, body} = req

    if (debug_level >= 2) console.log('----- certificate request -----')
    if (debug_level >= 2) console.log('request input:', JSON.stringify((req.body ? {...req, body: `${req.body.length} bytes`} : req), null, 2))

    return await proxyRequest(urls.certificate, 'POST', req.headers, req.body)

    // output resolves to:
    //   String (in base64 encoding), Buffer, TypedArray, or ArrayBuffer
  },

  getLicense: async function(req) {
    // input:
    //   const {method, headers, xhr, secure, protocol, path, params, query, body} = req

    if (debug_level >= 2) console.log('----- license request -----')
    if (debug_level >= 2) console.log('request input:', JSON.stringify((req.body ? {...req, body: `${req.body.length} bytes`} : req), null, 2))

    return await proxyRequest(urls.license, 'POST', req.headers, req.body)

    // output resolves to:
    //   String (in base64 encoding), Buffer, TypedArray, or ArrayBuffer
  }
}
