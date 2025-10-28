# Disable git pager
$env:LESS = ""
$env:GIT_PAGER = ""

Write-Host "Resolving conflicts..."

# Accept friend's version for Chatbot
Write-Host "Using friend's version of Chatbot.tsx"
git checkout --theirs src/components/Chatbot.tsx
git add src/components/Chatbot.tsx

# Accept our version for TailorInterviewModal (already resolved)
Write-Host "Using our version of TailorInterviewModal.tsx"
git add src/components/TailorInterviewModal.tsx

# Accept our version for NavigationMobile
Write-Host "Using our version of NavigationMobile.tsx"
git checkout --ours src/components/NavigationMobile.tsx
git add src/components/NavigationMobile.tsx

# Accept our version for Navigation
Write-Host "Using our version of Navigation.tsx"
git checkout --ours src/components/Navigation.tsx
git add src/components/Navigation.tsx

# Accept our version for dashboard
Write-Host "Using our version of dashboard/page.tsx"
git checkout --ours src/app/dashboard/page.tsx
git add src/app/dashboard/page.tsx

# Accept our version for DashboardMobile
Write-Host "Using our version of DashboardMobile.tsx"
git checkout --ours src/components/DashboardMobile.tsx
git add src/components/DashboardMobile.tsx

# Accept our version for search page
Write-Host "Using our version of search/page.tsx"
git checkout --ours src/app/search/page.tsx
git add src/app/search/page.tsx

# Accept our version for globals.css
Write-Host "Using our version of globals.css"
git checkout --ours src/app/globals.css
git add src/app/globals.css

# Accept friend's version for all other files
Write-Host "Using friend's version for all other conflicted files..."
git checkout --theirs NEWSLETTER-SETUP-GUIDE.md
git checkout --theirs VERCEL-KV-SETUP.md
git checkout --theirs src/app/api/admin/migrate-to-kv/route.ts
git checkout --theirs src/app/api/debug/ai-config/route.ts
git checkout --theirs src/app/api/debug/auth-status/route.ts
git checkout --theirs src/app/api/debug/check-current-user/route.ts
git checkout --theirs src/app/api/debug/clear-storage/route.ts
git checkout --theirs src/app/api/debug/downgrade-to-free/route.ts
git checkout --theirs src/app/api/debug/force-logout/route.ts
git checkout --theirs src/app/api/debug/list-all-users/route.ts
git checkout --theirs src/app/api/debug/stripe-config/route.ts
git checkout --theirs src/app/api/debug/stripe-webhook-test/route.ts
git checkout --theirs src/app/api/debug/webhook-test/route.ts
git checkout --theirs src/app/api/subscriptions/create-portal/route.ts
git checkout --theirs src/app/api/test-db/route.ts
git checkout --theirs src/app/api/test-signup/route.ts
git checkout --theirs src/app/clear-storage/page.tsx
git checkout --theirs src/app/dashboard-debug/page.tsx
git checkout --theirs src/app/mobile-test/page.tsx
git checkout --theirs src/app/page.tsx
git checkout --theirs src/app/video-interview/page.tsx
git checkout --theirs src/lib/database-persistent.ts

# Stage all resolved files
git add .

Write-Host "All conflicts resolved! Ready to commit."
Write-Host "Run: git commit -m 'Merge changes from main, keeping tailor interview modal and Pro badge'"

