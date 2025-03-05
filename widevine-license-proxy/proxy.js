const cors = require('cors')
const express = require('express')

const lib = require('./lib')

const addRoutes = function(app, serverConfigs) {
  if (!app || !Array.isArray(serverConfigs) || !serverConfigs.length) return

  app.use(express.raw({limit: '1mb', type: () => true}))
//app.use(express.json())
//app.use(express.urlencoded({extended: false}))
  app.use(cors())

  for (let serverConfig of serverConfigs) {
    if (!serverConfig || (typeof serverConfig !== 'object') || !serverConfig.route || !serverConfig.getCertificate || !serverConfig.getLicense) continue

    app.use(serverConfig.route, getMiddleware(serverConfig))
  }
}

const getMiddleware = function({getCertificate, getLicense}) {
  return async function(req, res) {
    try {
      const reqCopy = cloneReq(req)

      let data
      if (reqCertificate(reqCopy))
        data = await getCertificate(reqCopy, lib)
      else
        data = await getLicense(reqCopy, lib)

      if (data) {
        if (!(data instanceof Buffer)) {
          if (typeof data === 'string')
            data = lib.base64ToArrayBuffer(data)

          if ((data instanceof ArrayBuffer) || ArrayBuffer.isView(data))
            data = lib.arrayBufferToNodeBuffer(data)
        }

        if (data instanceof Buffer) {
          res.status(200).send(data)
          return
        }
        else {
          console.log('WARNING: non-binary response body was detected')
          console.log(JSON.stringify(data, null, 2))
        }
      }
    }
    catch(e) {}

    res.status(500).end()
  }
}

const cloneReq = (req) => {
  const reqCopy = {
    headers: cloneHeaders(req),
    body:    cloneBody(req)
  }

  if (!reqCopy.body && req.body) {
    console.log('WARNING: non-binary request body was removed')
    console.log(JSON.stringify(req.body, null, 2))
  }

  for (let key of ['method', 'xhr', 'secure', 'protocol', 'path', 'params', 'query']) {
    reqCopy[key] = (typeof req[key] === 'object')
      ? {...req[key]}
      : req[key]
  }

  return reqCopy
}

const cloneHeaders = (req) => {
  if (!req.headers) return null

  const hdrCopy = {}
  const whitelist = ['origin', 'referer', 'user-agent', 'accept', 'accept-language']
  for (let name of Object.keys(req.headers)) {
    if (
      (whitelist.indexOf(name) >= 0) ||
      ((name.length > 2) && (name.substring(0, 2) === 'x-'))
    ) {
      hdrCopy[name] = req.headers[name]
    }
  }
  return hdrCopy
}

const crtBody = Buffer.from('0804', 'hex')

const cloneBody = (req) => {
  if (req.method.toUpperCase() !== 'POST')
    return Buffer.from(crtBody)

  if (req.body instanceof Buffer)
    return Buffer.from(req.body)

  if ((req.body instanceof ArrayBuffer) || ArrayBuffer.isView(req.body))
    return lib.arrayBufferToNodeBuffer(req.body)

  return null
}

const reqCertificate = function(req) {
  return (req.method.toUpperCase() !== 'POST') || ((req.body instanceof Buffer) && (req.body.length === 2) && req.body.equals(crtBody))
}

module.exports = addRoutes
