@echo off
setlocal

REM === Voting SaaS Project Structure Setup for Windows ===

set "ROOT=%~dp0"

echo Creating project structure in: %ROOT%

REM Create directories
mkdir ".github\workflows"
mkdir "src\config"
mkdir "src\core"
mkdir "src\modules\auth"
mkdir "src\modules\contexts"
mkdir "src\modules\elections"
mkdir "src\modules\votes"
mkdir "src\modules\audit"
mkdir "src\db"
mkdir "src\middleware"
mkdir "public"

REM Create placeholder files (to ensure folders are created even if empty)
type nul > ".github\workflows\ci.yml"
type nul > "src\config\db.js"
type nul > "src\config\swagger.js"
type nul > "src\core\responses.js"
type nul > "src\core\logger.js"
type nul > "src\core\contextLoader.js"
type nul > "src\modules\auth\routes.js"
type nul > "src\modules\auth\controller.js"
type nul > "src\modules\auth\service.js"
type nul > "src\modules\contexts\routes.js"
type nul > "src\modules\contexts\controller.js"
type nul > "src\modules\contexts\service.js"
type nul > "src\modules\elections\routes.js"
type nul > "src\modules\elections\controller.js"
type nul > "src\modules\elections\service.js"
type nul > "src\modules\votes\routes.js"
type nul > "src\modules\votes\service.js"
type nul > "src\modules\audit\model.js"
type nul > "src\modules\audit\service.js"
type nul > "src\db\knexfile.js"
mkdir "src\db\migrations"
type nul > "src\middleware\ipCapture.js"
type nul > "src\middleware\errorHandler.js"
type nul > "src\app.js"
type nul > "src\server.js"
type nul > "public\.gitkeep"

REM Create root files
type nul > "docker-compose.yml"
type nul > "Dockerfile"
type nul > "package.json"
type nul > ".env.example"
type nul > "README.md"

echo.
echo ✅ Project structure created successfully!
echo.
echo Next steps:
echo 1. Run: npm init -y
echo 2. Install dependencies (see documentation)
echo 3. Start coding in src/
pause