# 🚨 CRITICAL: Fix Arbitrum Sepolia RPC Issues

## The Problem

The **default Arbitrum Sepolia RPC endpoint is DOWN**. This causes all deployment attempts to fail with errors like:
- `"could not coalesce error"`
- `"Failed to fetch"`
- `"Internal JSON-RPC error"`
- Error code: `-32603`

**You MUST change your MetaMask RPC URL to deploy successfully.**

---

## ✅ Solution: Change MetaMask RPC (5 Minutes)

### Method 1: Quick Fix (Recommended)

1. **Open MetaMask** browser extension
2. **Click the network dropdown** at the top (currently showing "Arbitrum Sepolia")
3. **Click the ⋮ (three dots)** next to "Arbitrum Sepolia"
4. **Select "Edit"**
5. **Scroll down to find "RPC URL"**
6. **Replace the current URL with:**
   ```
   https://arbitrum-sepolia.blockpi.network/v1/rpc/public
   ```
7. **Click "Save"**
8. **Disconnect wallet** from the app and **reconnect**
9. **Try deploying again** - it should work now! 🎉

### Method 2: Auto-Add via ChainList

1. Visit: **https://chainlist.org/chain/421614**
2. **Connect your wallet**
3. **Click "Add to MetaMask"**
4. **Select the RPC** with the best latency
5. **Switch to the new network**
6. **Done!**

---

## 🧪 Test Your RPC Connection

Before deploying, test if your RPC is working:

1. Open: **http://localhost:3000/rpc-tester.html** (when dev server is running)
2. Click **"Test Current MetaMask RPC"**
3. If it shows ✅ WORKING - you're good to deploy!
4. If it shows ❌ FAILED - change your RPC using the steps above

---

## 📋 Working RPC Endpoints (December 2025)

Try these in order if one doesn't work:

```
Primary:   https://arbitrum-sepolia.blockpi.network/v1/rpc/public
Secondary: https://arbitrum-sepolia-rpc.publicnode.com
Fallback:  https://sepolia-rollup.arbitrum.io/rpc (currently down)
```

---

## 🎯 What Changed in the App

The deployment system now:
- ✅ Uses MetaMask's `eth_sendTransaction` directly (more reliable)
- ✅ Automatically retries 3 times on network errors
- ✅ Tests multiple RPC endpoints for health checks
- ✅ Polls for transaction receipts instead of waiting
- ✅ Shows clear error messages guiding you to fix RPC
- ✅ Displays prominent RPC warning banner on deploy page

---

## ❓ Troubleshooting

### "Transaction rejected in MetaMask"
- You clicked "Reject" - click "Deploy" again and approve it

### "Insufficient funds"
- Get testnet ETH from: https://faucet.quicknode.com/arbitrum/sepolia

### "Still getting RPC errors after changing URL"
1. **Close and reopen** MetaMask
2. **Clear MetaMask cache**: Settings → Advanced → Clear activity tab data
3. **Disconnect** wallet from app completely
4. **Reconnect** and try again

### "None of the RPCs work"
- Arbitrum Sepolia might be experiencing network-wide issues
- Check: https://status.arbitrum.io
- Wait 10-15 minutes and try again

---

## 🎓 Why This Happens

Public RPC endpoints:
- Can go down or get rate-limited
- Are shared by thousands of developers
- May have connectivity issues
- Need to be changed periodically

MetaMask stores the RPC URL per network, so you only need to change it once.

---

## ✨ After Fixing

Once your RPC is updated:
1. Deployments will be **fast** (5-15 seconds)
2. No more connection errors
3. You'll see transaction status in real-time
4. Check deployed contracts on: https://sepolia.arbiscan.io

---

**Need Help?** If you're still having issues after following all steps, the Arbitrum Sepolia testnet might be experiencing widespread problems. Check the status page and try again later.

