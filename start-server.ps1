# Talentix Development Server Startup Script
# This ensures the server always runs on port 3000

Write-Host "🚀 Starting Talentix development server..." -ForegroundColor Yellow

# Stop any existing Node.js processes
Write-Host "🛑 Stopping existing Node.js processes..." -ForegroundColor Red
try {
    taskkill /F /IM node.exe 2>$null | Out-Null
    Write-Host "✅ Stopped existing processes" -ForegroundColor Green
}
catch {
    Write-Host "ℹ️  No existing processes to stop" -ForegroundColor Blue
}

# Wait a moment for ports to be released
Write-Host "⏳ Waiting for ports to be released..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Clear Next.js cache if it exists
if (Test-Path ".next") {
    Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Cache cleared" -ForegroundColor Green
}

# Start the development server on port 3000
Write-Host "🌐 Starting server on http://localhost:3000..." -ForegroundColor Green
npm run dev

Write-Host "🎉 Server should now be running on port 3000!" -ForegroundColor Green
Write-Host "📝 Google OAuth redirect URI should be: http://localhost:3000/api/auth/callback/google" -ForegroundColor Cyan 
 
 
 
 
 
 
 