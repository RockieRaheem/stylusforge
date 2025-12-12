# Vercel Deployment Quick Start

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RockieRaheem/stylusforge)

---

## 📝 Manual Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
cd stylus_studio
vercel
```

### 4. Set Environment Variables

Go to Vercel Dashboard → Settings → Environment Variables and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_nft_contract (optional)
```

### 5. Redeploy
```bash
vercel --prod
```

---

## ✅ That's it!

Your app will be live at: `https://your-project.vercel.app`

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
