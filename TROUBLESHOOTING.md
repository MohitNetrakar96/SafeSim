# ⚠️ TROUBLESHOOTING: "Failed to fetch" Error

## 🔍 QUICK DIAGNOSIS

The "Failed to fetch" error means the frontend can't connect to the backend API.

---

## ✅ SOLUTIONS (Try in order):

### **1. Verify Backend is Running** ⭐ MOST COMMON

Check your backend terminal window:
- You should see: `Server running on http://localhost:3001`
- If you see errors or nothing, the backend isn't running properly

**Fix:**
```bash
# Stop the backend (Ctrl+C in backend terminal)
# Then restart:
npm run dev
```

---

### **2. Test Backend Connection**

Open your browser and visit:
```
http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running!"
}
```

**If this doesn't work:**
- Backend is NOT running → Check terminal for errors
- Port 3001 might be blocked → Try a different port

---

### **3. Check Frontend .env File**

**File:** `frontend/.env`

Make sure it has:
```env
VITE_API_URL=http://localhost:3001
```

**After editing .env:**
- Stop frontend (Ctrl+C)
- Restart: `npm run dev`

---

### **4. Check CORS Settings**

The backend already has CORS enabled, but verify:

**File:** `backend/src/server.ts`

Should have:
```typescript
app.use(cors());
```

---

### **5. Restart Both Servers**

Sometimes a fresh start fixes everything:

```bash
# Backend terminal:
Ctrl+C
npm run dev

# Frontend terminal (in a new window):
Ctrl+C
npm run dev
```

---

## 🧪 TEST THE FIX

After trying the solutions above:

1. **Test backend directly:**
   ```
   http://localhost:3001/api/health
   ```
   Should show: `{"status": "ok"}`

2. **Test payment endpoint:**
   Use Postman or browser:
   ```
   POST http://localhost:3001/api/payment/create-payment-session
   
   Body:
   {
     "plan": "Pro",
     "billingCycle": "monthly",
     "price": 29
   }
   ```

3. **Test from frontend:**
   - Go to `http://localhost:5173/#pricing`
   - Click "Start Pro Trial"
   - Should redirect to Stripe (if keys are set) or show helpful error

---

## 🚨 COMMON ISSUES:

| Issue | Solution |
|-------|----------|
| Backend not starting | Check for TypeScript/syntax errors in terminal |
| Port 3001 in use | Change PORT in backend/.env or kill the process |
| CORS error | Verify `app.use(cors())` in server.ts |
| Wrong API URL | Check `VITE_API_URL` in frontend/.env |
| Firewall blocking | Allow Node.js through Windows Defender |

---

## 📝 QUICK CHECKLIST:

- [ ] Backend terminal shows "Server running on port 3001"
- [ ] `http://localhost:3001/api/health` works in browser
- [ ] `frontend/.env` has correct `VITE_API_URL`
- [ ] No firewall blocking localhost connections
- [ ] Both frontend and backend restarted after .env changes

---

## 🆘 STILL NOT WORKING?

### Check Backend Terminal for Errors:

Common errors and fixes:

**"Cannot find module 'stripe'"**
```bash
cd backend
npm install stripe
```

**"EADDRINUSE: Port 3001 already in use"**
```bash
# Windows:
npx kill-port 3001

# Or change port in backend/.env:
PORT=3002
```

**TypeScript compilation errors:**
```bash
cd backend
npm install --save-dev @types/node @types/express
```

---

## 💡 TEMPORARY WORKAROUND (DEMO MODE):

If you just want to test the UI without backend:

**Edit:** `frontend/src/components/PricingSection.tsx`

**Line 8, change:**
```typescript
const { handleStripeCheckout, loading } = usePayment();
```

**To:**
```typescript
const { handleDemoCheckout, loading } = usePayment();
```

**And Line 213, change:**
```typescript
handleStripeCheckout({
```

**To:**
```typescript
handleDemoCheckout({
```

This will show a demo message instead of real payment processing.

---

## ✅ VERIFIED FIX:

Once working, you should see:
1. Backend terminal: No errors, server running message
2. Browser at `localhost:3001/api/health`: JSON response
3. Clicking payment button: Redirects to Stripe or shows error message (not "Failed to fetch")

---

**Still stuck?** Check the backend terminal output for specific error messages!
