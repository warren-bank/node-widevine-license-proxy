@echo off

set wvlpd_js="%~dp0..\..\widevine-license-proxy\bin\wvlpd.js"

set wvlpd_node_opts=%wvlpd_node_opts% --no-warnings

set wvlpd_opts=%wvlpd_opts% -p 8081
set wvlpd_opts=%wvlpd_opts% --req-insecure

call node %wvlpd_node_opts% %wvlpd_js% %wvlpd_opts%

if not %ERRORLEVEL% EQU 0 (
  echo.
  pause
)
