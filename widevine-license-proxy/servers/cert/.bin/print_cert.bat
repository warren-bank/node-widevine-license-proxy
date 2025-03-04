@echo off

set openssl_HOME=C:\PortableApps\OpenSSL\1.1.0
set PATH=%openssl_HOME%;%PATH%

cd /D "%~dp0.."

openssl x509 -inform pem -noout -text -in cert.pem

echo.
pause
