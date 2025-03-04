const process_argv = require('@warren-bank/node-process-argv')

const argv_flags = {
  "--help":          {bool: true},
  "--version":       {bool: true},
  "--tls":           {bool: true},
  "--req-insecure":  {bool: true},
  "--port":          {num:  "int"},
  "--use":           {file: "module", many: true},
  "--tls-cert":      {file: "path-exists"},
  "--tls-key":       {file: "path-exists"},
  "--tls-pass":      {file: "path-exists"},
}

const argv_flag_aliases = {
  "--help":          ["-h"],
  "--version":       ["-v"],
  "--port":          ["-p"],
  "--use":           ["-u"]
}

let argv_vals = {}

try {
  argv_vals = process_argv(argv_flags, argv_flag_aliases)
}
catch(e) {
  console.log('ERROR: ' + e.message)
  process.exit(1)
}

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  let data = require('../../../package.json')
  console.log(data.version)
  process.exit(0)
}

// =============================================================================
// references:
// =============================================================================
//   https://nodejs.org/api/cli.html#cli_environment_variables
//   https://nodejs.org/api/cli.html#cli_node_tls_reject_unauthorized_value
// =============================================================================
if (argv_vals["--req-insecure"]) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
}

if (!argv_vals["--use"] || !Array.isArray(argv_vals["--use"]) || !argv_vals["--use"].length) {
  console.log('ERROR: must --use at least one server configuration')
  process.exit(1)
}
for (let i=0; i < argv_vals["--use"].length; i++) {
  const serverConfig = argv_vals["--use"][i]

  if (!serverConfig || (typeof serverConfig !== 'object') || !serverConfig.route || (typeof serverConfig.route !== 'string') || (typeof serverConfig.getCertificate !== 'function') || (typeof serverConfig.getLicense !== 'function')) {
    if (serverConfig.route && (typeof serverConfig.route === 'string'))
      console.log(`ERROR: server configuration #${i} is not valid for route "${serverConfig.route}"`)
    else
      console.log(`ERROR: server configuration #${i} is not valid`)

    process.exit(1)
  }
}

module.exports = argv_vals
