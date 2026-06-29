@echo off
cd /d C:\Users\kateh\Desktop\halmoni-school
if exist .git\index.lock del /f .git\index.lock 2>nul
if exist .git\HEAD.lock del /f .git\HEAD.lock 2>nul
echo.
echo Pushing to GitHub...
echo.
git push
echo.
echo ============================================
echo  Done! Check hangeulquest.com in 1-2 min
echo ============================================
pause
