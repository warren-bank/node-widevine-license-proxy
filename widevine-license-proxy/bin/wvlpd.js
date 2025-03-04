#! /usr/bin/env node

const express = require('express')
const app = express()

const argv_vals = require('./lib/process_argv')

require('../proxy')(
  app,
  argv_vals["--use"]
)

const use_tls = (argv_vals["--tls-cert"] && argv_vals["--tls-key"]) || argv_vals["--tls"]

const server = (use_tls)
  ? require('../servers/start_https')(app, {
      port:     argv_vals["--port"],
      tls_cert: argv_vals["--tls-cert"],
      tls_key:  argv_vals["--tls-key"],
      tls_pass: argv_vals["--tls-pass"]
    })
  : require('../servers/start_http')(app, {
      port:     argv_vals["--port"]
    })
