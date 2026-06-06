@echo off
chcp 65001 > nul
echo ============================================
echo  Hangeul Quest - 사이트 복구 스크립트
echo ============================================
echo.

cd /d C:\Users\kateh\Desktop\halmoni-school

echo [1/6] 잠금 파일 제거 중...
if exist .git\index.lock del /f .git\index.lock 2>nul
if exist .git\HEAD.lock del /f .git\HEAD.lock 2>nul
echo    완료

echo.
echo [2/6] Level 1 파일 임시 백업 중...
if not exist ..\level1_backup mkdir ..\level1_backup
xcopy /E /Y data\elem\level1\ ..\level1_backup\
copy korean-app_v2.html ..\korean-app_v2_level1.html
echo    완료

echo.
echo [3/6] 마지막 정상 상태로 복구 중... (438개 파일 복원)
git reset --hard a7b450f
if errorlevel 1 (
    echo 오류: reset 실패. 화면 캡처해서 보내주세요.
    pause
    exit /b 1
)
echo    완료

echo.
echo [4/6] Level 1 파일 복원 중...
if not exist data\elem\level1 mkdir data\elem\level1
xcopy /E /Y ..\level1_backup\ data\elem\level1\
copy ..\korean-app_v2_level1.html korean-app_v2.html
echo    완료

echo.
echo [5/6] 커밋 중...
git add data\elem\level1\
git add docs\HQ_KIDS_LEVEL1_CONTENT_PLAN.md
git add korean-app_v2.html
git commit -m "Kids Level 1: 예비과+unit01~09 JSON, 인터랙티브 자모탐험기, Level1 렌더러"
if errorlevel 1 (
    echo 오류: 커밋 실패.
    pause
    exit /b 1
)

echo.
echo [6/6] GitHub에 강제 push 중...
git push --force origin main
if errorlevel 1 (
    echo 오류: push 실패.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  완료! hangeulquest.com 복구 + Level 1 추가
echo  (사이트 반영에 1~2분 소요)
echo ============================================
pause
