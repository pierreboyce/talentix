# 🗄️ Vercel KV Database Setup

This guide explains how to set up Vercel KV (Redis) for persistent data storage to prevent subscription data loss on deployments.

## 🚨 **Problem Solved**
- **Before:** Subscriptions were lost on every deployment due to ephemeral `/tmp` storage
- **After:** True persistence with Vercel KV Redis database

## 🛠️ **Setup Instructions**

### 1. **Create Vercel KV Database**
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (`talentix-public-site`)
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Choose a name: `talentix-kv`
7. Select region closest to your users (e.g., `fra1` for Europe)
8. Click **Create**

### 2. **Connect Database to Project**
1. In the KV database page, click **Connect Project**
2. Select your `talentix-public-site` project
3. Choose environment: **Production** (and Preview if needed)
4. Click **Connect**

### 3. **Environment Variables**
Vercel will automatically add these environment variables:
```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### 4. **Install Dependencies**
The `@vercel/kv` package should be installed:
```bash
npm install @vercel/kv
```

### 5. **Deploy and Migrate**
1. Deploy the updated code:
   ```bash
   vercel --prod
   ```

2. Migrate existing data (one-time operation):
   ```bash
   curl -X POST https://talentix.co.uk/api/admin/migrate-to-kv \
     -H "Content-Type: application/json" \
     -d '{"adminKey": "migrate_talentix_data_2024"}'
   ```

## 🔄 **How It Works**

### **Automatic Fallback System**
- **Primary:** Vercel KV (Redis) - True persistence
- **Fallback:** File-based system if KV unavailable
- **Seamless:** No code changes needed in components

### **Data Storage**
- **Users:** Stored with multiple keys for efficient lookup
  - `user:email:{email}` → Full user object
  - `user:id:{id}` → Full user object
  - `users:all` → Set of all user IDs

### **Benefits**
- ✅ **Persistent:** Data survives deployments
- ✅ **Fast:** Redis performance
- ✅ **Scalable:** Handles growth
- ✅ **Reliable:** Automatic backups
- ✅ **Fallback:** Works without KV if needed

## 📊 **Monitoring**

### **Check KV Status**
```bash
# Check if KV is working
curl https://talentix.co.uk/api/debug/check-user?email=pierreboyce70@gmail.com
```

### **Logs to Watch**
- `✅ Vercel KV initialized successfully` - KV working
- `⚠️ Vercel KV not configured` - Missing env vars
- `📊 User found in Vercel KV` - Data read from KV
- `⚠️ KV read error, falling back` - Using fallback

## 🚀 **Production Checklist**
- [ ] Vercel KV database created
- [ ] Environment variables configured
- [ ] Code deployed with KV integration
- [ ] Migration completed successfully
- [ ] Subscription data persists after deployment
- [ ] Fallback system tested

## 💡 **Troubleshooting**

### **KV Not Working?**
1. Check environment variables in Vercel dashboard
2. Ensure `@vercel/kv` package is installed
3. Check deployment logs for KV errors
4. System will automatically fall back to file storage

### **Migration Issues?**
1. Run migration endpoint manually
2. Check existing user data in `/tmp/talentix_users.json`
3. Verify KV connection in logs

## 🔐 **Security Notes**
- KV data is encrypted at rest
- Access controlled by Vercel tokens
- Migration endpoint has admin key protection
- User passwords remain hashed

Your subscription data will now persist across all deployments! 🎉







