#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FNAME="$( basename "${BASH_SOURCE[0]}" )"

# -------------------------------------------------------------------- configuration:

wvlpd_opts=(--use "${DIR}/server-config.js")

# -------------------------------------------------------------------- execution:

source "${DIR}/../.bin/${FNAME}"
