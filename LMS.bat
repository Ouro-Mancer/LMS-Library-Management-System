@echo off
echo Starting Backend...
cd backend
start cmd /k "npm run dev"
cd ..

echo Starting Frontend...
cd frontend
start cmd /k "npm run dev"
cd ..


