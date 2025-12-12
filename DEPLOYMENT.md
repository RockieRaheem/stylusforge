# 🚀 Deployment Guide - Vercel

This guide will help you deploy **Stylus Studio** to Vercel with automated CI/CD pipeline.

---

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier works!)
- [GitHub Account](https://github.com) (for CI/CD)
- Firebase project configured
- (Optional) NFT contract deployed to Arbitrum

---

## 🎯 Quick Deploy (3 Steps)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd stylus_studio
vercel
```

Follow the prompts and your app will be live! 🎉

---

## 🔧 Manual Deployment Setup

### 1. **Connect GitHub Repository**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `RockieRaheem/stylusforge`
4. Click **"Import"**

### 2. **Configure Environment Variables**

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

#### **Required Variables (Public)**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### **Optional Variables**
```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddress
```

#### **Server-Side Variables (Private)**
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKey\n-----END PRIVATE KEY-----"
```

💡 **Tip:** Copy these from your `.env.local` file

### 3. **Configure Build Settings**

Vercel should auto-detect Next.js, but verify:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 20.x
```

### 4. **Deploy**

Click **"Deploy"** and wait ~2-3 minutes for the build to complete.

---

## ⚙️ Automated CI/CD Pipeline

### **What's Included**

✅ **Automated Testing** - Runs on every push and PR
✅ **Type Checking** - TypeScript validation
✅ **Linting** - Code quality checks
✅ **Preview Deployments** - Automatic preview for PRs
✅ **Production Deployments** - Auto-deploy on merge to `master`
✅ **PR Comments** - Deployment URLs posted to PRs

### **Setup GitHub Secrets**

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add the following secrets:

#### **Required Secrets**

```bash
VERCEL_TOKEN          # Get from vercel.com/account/tokens
VERCEL_ORG_ID         # Get from vercel project settings
VERCEL_PROJECT_ID     # Get from vercel project settings
```

#### **Firebase Secrets (for build)**

```bash
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### **How to Get Vercel Tokens**

1. **VERCEL_TOKEN:**
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it "GitHub Actions"
   - Copy the token

2. **VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
   ```bash
   # Run in your project directory
   vercel link
   cat .vercel/project.json
   ```
   Copy `orgId` and `projectId`

---

## 🔄 Deployment Workflow

### **On Pull Request:**
1. ✅ Runs tests and linting
2. ✅ Builds the project
3. ✅ Deploys preview version
4. ✅ Posts preview URL as PR comment

### **On Merge to Master:**
1. ✅ Runs full test suite
2. ✅ Builds production bundle
3. ✅ Deploys to production domain
4. ✅ Updates live site automatically

---

## 🌐 Custom Domain Setup

### **Add Custom Domain**

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `stylusstudio.dev`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours max)

### **Recommended DNS Setup**

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

## 📊 Deployment Status

### **Check Build Status**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Actions:** https://github.com/RockieRaheem/stylusforge/actions

### **View Logs**

```bash
# View deployment logs
vercel logs <deployment-url>

# Stream real-time logs
vercel logs <deployment-url> --follow
```

---

## 🐛 Troubleshooting

### **Build Fails: "Module not found"**
```bash
# Solution: Clear cache and rebuild
vercel --force
```

### **Environment Variables Not Working**
- Make sure they're added in Vercel Dashboard
- Check they're assigned to correct environment (Production/Preview/Development)
- Redeploy after adding new variables

### **Firebase Connection Error**
```bash
# Verify Firebase config
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
```

### **Monaco Editor Not Loading**
- Add to `next.config.ts`:
```typescript
webpack: (config) => {
  config.resolve.fallback = { fs: false, path: false };
  return config;
}
```

---

## 🔒 Production Checklist

Before going to production:

- [ ] All environment variables set
- [ ] Firebase security rules configured
- [ ] NFT contract deployed (if using)
- [ ] Custom domain configured (optional)
- [ ] Error tracking setup (Sentry, LogRocket)
- [ ] Analytics configured (Google Analytics, Plausible)
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place
- [ ] Security headers configured

---

## 📈 Performance Optimization

### **Vercel Analytics**

Enable in Vercel Dashboard → Analytics

### **Edge Functions**

API routes automatically deployed to Edge:
```
/api/compile → Edge Function
/api/deploy → Edge Function
```

### **Image Optimization**

Already configured in `next.config.ts`:
```typescript
images: {
  domains: ['firebasestorage.googleapis.com']
}
```

---

## 💰 Cost Estimate

### **Vercel Pricing**

- **Hobby Plan:** FREE
  - 100 GB bandwidth/month
  - 6,000 build minutes/month
  - Unlimited deployments
  - Perfect for this project!

- **Pro Plan:** $20/month (if needed)
  - 1 TB bandwidth
  - Better analytics
  - Team collaboration

### **Firebase Pricing**

- **Spark Plan:** FREE
  - 1 GB storage
  - 10 GB bandwidth/month
  - Enough for 1000+ users

---

## 🚀 Deployment Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Alias deployment to custom domain
vercel alias <deployment-url> <domain>

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>

# View environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Pull latest environment variables
vercel env pull .env.local
```

---

## 📞 Support

Issues with deployment?

- **Email:** kamwangaraheem2050@gmail.com
- **WhatsApp:** +256704057370
- **GitHub Issues:** https://github.com/RockieRaheem/stylusforge/issues

---

## ✅ Post-Deployment Steps

1. **Test the deployment:**
   - Visit your Vercel URL
   - Test all features
   - Check browser console for errors

2. **Update README:**
   - Add live demo link
   - Update deployment status badge

3. **Monitor performance:**
   - Check Vercel Analytics
   - Monitor Firebase usage

4. **Announce launch:**
   - Share on Twitter/X
   - Post in Arbitrum Discord
   - Submit to web3 directories

---

**Your app is now live and automatically deploys on every push to master!** 🎉

Happy deploying! 🚀
