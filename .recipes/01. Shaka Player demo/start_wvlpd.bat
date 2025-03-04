@echo off

set wvlpd_opts=--use "%~dp0.\server-config.js"

call "%~dp0..\.bin\%~nx0"
