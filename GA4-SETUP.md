# 🎯 Google Analytics 4 (GA4) Setup Guide for Talentix

## Quick Setup Steps

### Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. If you don't have an account, create one (free)
3. Click "Admin" (gear icon in bottom left)
4. Under "Property", click "Create Property"
5. Choose **GA4** (not Universal Analytics)
6. Fill in:
   - Property name: "Talentix Website"
   - Reporting time zone: "United Kingdom"
   - Currency: "British Pound"
7. Click "Next" → "Create"
8. Under "Data Streams", click "Add stream" → "Web"
9. Enter:
   - Website URL: `https://talentix.co.uk`
   - Stream name: "Talentix Website"
10. Click "Create stream"
11. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add this line:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. **For Vercel Production:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` with your Measurement ID
   - Select: Production, Preview, Development
   - Click "Save"

### Step 3: Deploy & Verify

1. Deploy your changes (or restart dev server)
2. Visit your website
3. Open browser DevTools (F12)
4. Go to Network tab
5. Look for requests to `googletagmanager.com` - you should see GA4 loading
6. In Google Analytics, go to "Reports" → "Realtime"
7. Visit your website - you should see yourself appear in real-time reports

---

## ✅ What's Already Implemented

The GA4 tracking tag has been added to your website:

1. **Global Tag** (`src/app/layout.tsx`):
   - Loads Google Analytics script on every page
   - Tracks page views automatically
   - Only loads if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set

2. **Page View Tracking** (`src/components/GoogleAnalytics.tsx`):
   - Automatically tracks page navigation
   - Works with Next.js routing

3. **Event Tracking Utilities** (`src/lib/gtag.ts`):
   - Ready-to-use functions for tracking custom events
   - Functions available:
     - `pageview(url)` - Track page views
     - `event({action, category, label, value})` - Track custom events
     - `trackConversion(eventName, value)` - Track conversions
     - `trackFeatureUsage(featureName)` - Track feature usage

---

## 🎯 Recommended Events to Track

You can now track these important events:

```typescript
import { trackConversion, trackFeatureUsage } from '@/lib/gtag';

// Track when someone signs up
trackConversion('sign_up');

// Track CV reviews
trackFeatureUsage('cv_review');

// Track interview practices
trackFeatureUsage('interview_practice');

// Track job applications
trackConversion('job_application', 1);

// Track subscriptions
trackConversion('subscription_started', 3.99);
```

---

## 📊 What You Can Track

### Automatic Tracking:
- ✅ Page views
- ✅ Page titles
- ✅ Page paths
- ✅ User sessions
- ✅ Bounce rate
- ✅ Session duration

### Custom Events You Can Add:
- User sign-ups
- CV reviews completed
- Interview practices started
- Job applications tracked
- Subscriptions started
- Feature usage

---

## 🔍 Verify It's Working

### Method 1: Browser DevTools
1. Open your website
2. Press F12 (DevTools)
3. Go to Network tab
4. Filter by "gtag" or "google-analytics"
5. You should see requests to `googletagmanager.com`

### Method 2: Google Analytics Realtime
1. Go to Google Analytics
2. Reports → Realtime
3. Visit your website
4. You should appear in the real-time report within seconds

### Method 3: Google Tag Assistant
1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Click the extension icon
4. You should see GA4 tag detected

---

## 📝 Important Notes

1. **Environment Variable**: Make sure `NEXT_PUBLIC_GA_MEASUREMENT_ID` starts with `NEXT_PUBLIC_` so it's available in the browser
2. **Privacy**: GA4 respects user privacy settings and is GDPR compliant
3. **No Breaking Changes**: GA4 tracking is conditional - if the ID isn't set, nothing breaks
4. **Production Only**: Consider only enabling GA4 in production (check `NODE_ENV === 'production'`)

---

## 🚀 Next Steps

1. ✅ Add your Measurement ID to `.env.local`
2. ✅ Add to Vercel environment variables
3. ✅ Deploy and verify
4. ✅ Set up custom events (optional)
5. ✅ Create custom reports in GA4 dashboard
6. ✅ Set up goals/conversions for important actions

---

## ❓ Troubleshooting

### GA4 not tracking?
- Check Measurement ID is correct
- Verify environment variable is set
- Check browser console for errors
- Make sure you're not using an ad blocker

### Events not showing?
- Wait 24-48 hours for data to appear
- Check Realtime reports first (instant)
- Verify event code is being called
- Check GA4 DebugView

### Still having issues?
- Check Google Analytics Help: https://support.google.com/analytics
- Verify your Measurement ID format: `G-XXXXXXXXXX`
- Check Network tab in DevTools for failed requests

---

**Implementation Complete!** ✅

Your GA4 tracking is now set up and ready to collect data once you add your Measurement ID.

