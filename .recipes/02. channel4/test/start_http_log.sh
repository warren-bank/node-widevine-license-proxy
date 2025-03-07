#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# https://github.com/warren-bank/fork-node-http-log

http-log >"${DIR}/start_http_log.log" 2>&1
