# 🚀 Talentix Deployment Guide

## Domain Configuration for talentix.co.uk

### 🌟 Coming Soon Page Protection
The entire site is now protected by a fun and playful coming soon page with password protection.

**Password:** `yourfirstjob129!`

### 📋 Deployment Steps

#### 1. Domain Setup
- Point your domain `talentix.co.uk` to your hosting provider
- Configure DNS records:
  - A record: `@` → Your server IP
  - CNAME record: `www` → `talentix.co.uk`

#### 2. Environment Variables
Create a `.env.local` file with:
```env
SITE_URL=https://talentix.co.uk
SITE_NAME=Talentix
NEXTAUTH_URL=https://talentix.co.uk
NEXTAUTH_SECRET=your-secret-key-here
```

#### 3. Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add custom domain in Vercel dashboard:
   - Go to Project Settings → Domains
   - Add `talentix.co.uk` and `www.talentix.co.uk`
3. Environment variables will be automatically configured

#### 4. Alternative Hosting Providers
- **Netlify:** Use the `vercel.json` as reference for redirects
- **AWS Amplify:** Configure custom domain in the console
- **Railway/Render:** Add domain in project settings

### 🔒 Password Protection Features

#### How it Works:
1. **Middleware Protection:** All routes are protected by middleware
2. **Cookie-based Access:** Sets `talentix_access=authenticated` cookie for 24 hours
3. **Fun UX:** Animated background, shake effects on wrong password, hints after 3 attempts

#### Password Features:
- **Password:** `yourfirstjob129!`
- **Hint System:** Appears after 2 failed attempts
- **Visual Feedback:** Shake animation on incorrect password
- **Persistent Access:** 24-hour cookie duration

#### Accessing the Site:
1. Visit `https://talentix.co.uk`
2. Enter password: `yourfirstjob129!`
3. Click "🚀 Launch Into Talentix! 🌟"
4. Full site access for 24 hours

### 🎨 Coming Soon Page Features

- **Animated Gradient Background:** Smooth color transitions
- **Floating Elements:** Animated emojis (🚀✨🎯💼🌟🎉)
- **Glass Morphism Design:** Modern frosted glass effect
- **Responsive Layout:** Works on all devices
- **Interactive Elements:** Hover effects and animations
- **Progress Hints:** Helpful hints after failed attempts
- **Statistics Display:** Fake stats to build excitement

### 🛠️ Customization

#### Changing the Password:
1. Edit `src/app/coming-soon/page.tsx`
2. Update `const correctPassword = 'yourfirstjob129!';`
3. Redeploy

#### Disabling Coming Soon:
1. Comment out the coming soon logic in `src/middleware.ts`
2. Or set an environment variable to bypass

#### Styling Changes:
- All styles are inline for easy customization
- Gradient colors, animations, and layout can be modified
- Uses Fredoka font family for playful appearance

### 📱 Mobile Optimization
- Responsive design works on all screen sizes
- Touch-friendly buttons and inputs
- Optimized animations for mobile performance

### 🔍 SEO Considerations
- Meta tags optimized for coming soon page
- Proper redirects configured
- Search engines will see the coming soon page until password is entered

### 🚀 Go Live Checklist
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Password protection tested
- [ ] Mobile responsiveness verified
- [ ] All animations working
- [ ] 24-hour cookie persistence confirmed

Your fun and playful Talentix coming soon page is ready to launch! 🎉
