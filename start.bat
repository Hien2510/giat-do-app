@echo off
chcp 65001 >nul
rem Đổi 1234 thành mã PIN của tiệm
set APP_PIN=2067
node server.js
pause
