#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# -------------------------------------------------------------------- configuration:

if [ -z "$wvlpd_node_opts" ];then
  wvlpd_node_opts=()
fi

if [ -z "$wvlpd_opts" ];then
  wvlpd_opts=()
fi

wvlpd_js="${DIR}/../../widevine-license-proxy/bin/wvlpd.js"

wvlpd_node_opts+=('--no-warnings')

wvlpd_opts+=(-p 8080)
wvlpd_opts+=(--req-insecure)

# -------------------------------------------------------------------- execution:

node "${wvlpd_node_opts[@]}" "$wvlpd_js" "${wvlpd_opts[@]}"
