@echo off
set GIT_PAGER=
set LESS=

echo Resolving conflicts...

echo Using friend's version of Chatbot.tsx
git checkout --theirs src/components/Chatbot.tsx
git add src/components/Chatbot.tsx

echo Using our version of TailorInterviewModal.tsx
git add src/components/TailorInterviewModal.tsx

echo Using our version of NavigationMobile.tsx
git checkout --ours src/components/NavigationMobile.tsx
git add src/components/NavigationMobile.tsx

echo Using our version of Navigation.tsx  
git checkout --ours src/components/Navigation.tsx
git add src/components/Navigation.tsx

echo Using our version of dashboard/page.tsx
git checkout --ours src/app/dashboard/page.tsx
git add src/app/dashboard/page.tsx

echo Using our version of DashboardMobile.tsx
git checkout --ours src/components/DashboardMobile.tsx
git add src/components/DashboardMobile.tsx

echo Using our version of search/page.tsx
git checkout --ours src/app/search/page.tsx
git add src/app/search/page.tsx

echo Using our version of globals.css
git checkout --ours src/app/globals.css
git add src/app/globals.css

echo Using friend's version for all other files...
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

git add .

echo.
echo All conflicts resolved!
echo Run: git commit -m "Merge changes from main, keeping tailor interview modal and Pro badge"
pause

