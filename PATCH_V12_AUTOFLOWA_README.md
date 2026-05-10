# 🚀 CineScope Patch v12 FIXED — autoflowa.in Edition

**Mega patch with correct domain: `autoflowa.in`**

---

## 🎯 What's Included

### **1. 🔒 Security Hardening (v11)**
- Smart middleware with rate limiting (DDoS prevention)
- Bot/scraper blocking (sqlmap, nikto, etc.)
- Strict security headers (HSTS, CSP, X-Frame-Options, etc.)
- Input sanitization utilities
- Suspicious path blocking (`/.env`, `/.git`, etc.)

### **2. ✨ Clean Ad Architecture (v12)**
- ❌ Removed manual ad slots (homepage + movie page)
- ✅ AdUnit component now no-op (returns null)
- ✅ Auto Ads in AdSenseScript handles all placements
- 💰 Pub ID `ca-pub-6510553016832156` still active

### **3. 🌐 Domain: cinescope.autoflowa.in**
- ✅ All default URLs updated to `cinescope.autoflowa.in`
- ✅ Sitemap, OG, robots.txt, security.txt all use correct domain

---

## 📦 Apply (1 minute)

### **Step 1: Extract patch ZIP**

### **Step 2: Copy `cinescope/` folder over your project**
- Choose **"Replace All"** when asked

### **Step 3: Push to GitHub**

```bash
cd cinescope
git add .
git commit -m "Add security, clean ads, autoflowa.in domain"
git push
```

### **Step 4: Vercel auto-redeploys** (2-3 min)

---

## 🔑 Vercel Env Variables

🔗 https://vercel.com/dashboard → cinescope-amir → Settings → Environment Variables

### **Add or Update:**

```
Name:  NEXT_PUBLIC_SITE_URL
Value: https://cinescope.autoflowa.in
```

### **Verify These Exist:**
- ✅ `TMDB_API_KEY`
- ✅ `NEXT_PUBLIC_TMDB_API_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_SITE_URL` (autoflowa.in)

After saving env vars: **Deployments → Latest → ... → Redeploy** (uncheck cache)

---

## 🌐 Custom Domain Setup (autoflowa.in)

### **Vercel Side:**

1. Vercel → cinescope-amir → Settings → **Domains**
2. Click **"Add"** → Enter: `cinescope.autoflowa.in`
3. Vercel shows DNS record needed:
   ```
   Type:   CNAME
   Name:   cinescope
   Value:  cname.vercel-dns.com
   ```

### **Domain Provider Side (where autoflowa.in is hosted):**

1. Login → DNS Management
2. Add new record:
   - **Type:** CNAME
   - **Name/Host:** `cinescope`
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** 3600 (or Auto)
3. Save

### **Wait & Verify:**
- DNS propagation: 30 min - 2 hours
- Check: https://www.whatsmydns.net/ → `cinescope.autoflowa.in`
- Vercel auto-provisions SSL when DNS resolves

### **Test:**
Open: `https://cinescope.autoflowa.in` ✅

---

## 🛡️ Security Features

### **Middleware (`src/middleware.ts`)**

**Rate Limiting:**
| Path | Limit | Window |
|---|---|---|
| `/api/cron/*` | 10 req | 1 min |
| `/api/*` | 100 req | 1 min |
| Other pages | 200 req | 1 min |

**Bot Blocking:** sqlmap, nikto, nmap, masscan, metasploit, havij

**Path Blocking (returns 403):**
- `/.env`, `/.git`, `/wp-admin`, `/wp-login`
- `/admin/config`, `/phpinfo`, `/phpmyadmin`

**Security Headers:**
- HSTS (force HTTPS)
- CSP (XSS protection)
- X-Frame-Options DENY
- X-Content-Type-Options nosniff
- Referrer-Policy
- Permissions-Policy

### **Security Utilities (`src/lib/security.ts`)**
- `sanitizeText()`, `sanitizeUsername()`, `isValidEmail()`
- `checkPasswordStrength()`, `isValidUrl()`
- `hasSqlInjectionPattern()`, `sanitizeSearchQuery()`
- `isSafeRedirect()`, `maskSensitive()`

---

## 📁 Files in This Patch

```
cinescope/
├── public/
│   ├── robots.txt                           [REPLACED — autoflowa.in]
│   └── .well-known/
│       └── security.txt                     [REPLACED — autoflowa.in]
└── src/
    ├── middleware.ts                        [NEW — security]
    ├── lib/
    │   └── security.ts                      [NEW — sanitization]
    ├── app/
    │   ├── layout.tsx                       [MODIFIED — autoflowa.in]
    │   ├── page.tsx                         [MODIFIED — no manual ads]
    │   ├── api/
    │   │   ├── sitemap/route.ts             [MODIFIED — autoflowa.in]
    │   │   └── og/route.tsx                 [MODIFIED — autoflowa.in]
    │   └── movie/[slug]/page.tsx            [MODIFIED — no manual ads]
    └── components/
        └── ads/
            └── AdUnit.tsx                   [MODIFIED — no-op]
```

**10 files total**

---

## ✅ Verification Checklist (After Deploy)

- [ ] Site loads at `https://cinescope.autoflowa.in`
- [ ] No gray "Ad Slot" placeholders visible
- [ ] `/ads.txt` shows: `google.com, pub-6510553016832156, DIRECT, f08c47fec0942fa0`
- [ ] `/.env` returns 403 Forbidden ✅
- [ ] Security headers active (DevTools → Network → Headers)
- [ ] Movies/TV pages load
- [ ] Auth (login/register) works

---

## 🎯 After Apply Sequence

1. ✅ Apply patch (extract + copy + push)
2. ✅ Wait Vercel deploy (2-3 min)
3. ✅ Update env var: `NEXT_PUBLIC_SITE_URL=https://cinescope.autoflowa.in`
4. ✅ Redeploy after env var change
5. ✅ Setup DNS for `cinescope.autoflowa.in`
6. ✅ Wait DNS + SSL (1-2 hours)
7. ✅ Test on `cinescope.autoflowa.in`
8. ✅ AdSense Auto Ads kick in (1-24 hours)
9. 💰 **Money flows!**

---

*Apply karo → push karo → site secure + clean + monetized! 🚀🔒💰*
