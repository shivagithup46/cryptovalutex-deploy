Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; mvn spring-boot:run`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""
