@echo off

rem :: https://github.com/warren-bank/fork-node-http-log

http-log >"%~dpn0.log" 2>&1
