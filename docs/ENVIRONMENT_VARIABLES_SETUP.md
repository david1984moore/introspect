# Environment Variables Setup Guide
## Phase 10: Email Delivery & Completion Flow

This guide will walk you through obtaining all required environment variables for Phase 10.

---

## Step 1: Set Up Resend Account (Email Service)

### 1.1 Create Resend Account

1. Go to **https://resend.com**
2. Click **"Sign Up"** in the top right
3. Sign up with:
   - Email address (use your business email)
   - Password
   - Or use GitHub/Google OAuth

### 1.2 Get Your API Key

1. After logging in, you'll be taken to the **Dashboard**
2. Click on **"API Keys"** in the left sidebar (or go to https://resend.com/api-keys)
3. Click **"Create API Key"**
4. Give it a name: `Introspect Production` (or `Introspect Development` for testing)
5. Select permissions:
   - ✅ **Sending access** (required)
   - ❌ **Domain management** (optional, only if you want to manage domains via API)
6. Click **"Add"**
7. **IMPORTANT:** Copy the API key immediately - it starts with `re_` and looks like:
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   ⚠️ **You won't be able to see this again!** Save it securely.

### 1.3 Verify Your Domain

**IMPORTANT DISTINCTION:** Domain verification in Resend is about **EMAIL sending**, not about where your website is hosted.

**What domain verification means:**
- The domain you verify is the domain that will appear in the **"From"** email address
- Example: If you verify `applicreations.com`, you can send emails from `introspect@applicreations.com`
- This is **separate** from where Introspect is hosted (could be `introspect.applicreations.com`, `applicreations.com/introspect`, or even a different domain)

**For your setup:**
- ✅ Verify: `applicreations.com` (so you can send from `introspect@applicreations.com`)
- ✅ Introspect can be hosted anywhere: `applicreations.com/introspect`, `introspect.applicreations.com`, or even `introspect.com`
- ✅ The email domain and website domain don't need to match

**For Testing (Development):**
- ⚠️ **SKIP THIS STEP FOR NOW** - You can use `onboarding@resend.dev` without domain verification
- This works for testing but shows "via resend.dev" in email clients
- Perfect for development, not ideal for production
- See Step 3.1 for development setup

**For Production:**
- Verify `applicreations.com` to send from `introspect@applicreations.com`
- This looks professional and builds trust

**Steps to verify (for production):**

1. Go to **"Domains"** in the left sidebar (or https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain: `applicreations.com` (this is the domain for EMAIL sending, not website hosting)
4. Click **"Add Domain"**

**DNS Records to Add:**

Resend will show you DNS records to add. You'll need to add these to your domain's DNS settings:

1. **SPF Record** (Type: TXT)
   ```
   Name: @ (or leave blank)
   Value: v=spf1 include:resend.com ~all
   ```

2. **DKIM Records** (Type: TXT)
   - Resend will provide 3 DKIM records
   - Each has a unique name and value
   - Add all 3 to your DNS

3. **DMARC Record** (Type: TXT) - Optional but recommended
   ```
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:your-email@applicreations.com
   ```

**How to Add DNS Records:**

- **If using Cloudflare:**
  1. Go to your domain in Cloudflare
  2. Click **"DNS"** → **"Records"**
  3. Click **"Add record"**
  4. Select type (TXT), enter name and value
  5. Click **"Save"**

- **If using GoDaddy/Namecheap/Other:**
  1. Log into your domain registrar
  2. Go to DNS Management
  3. Add TXT records as shown above

**Wait for Verification:**
- DNS changes can take 5 minutes to 48 hours (usually 15-30 minutes)
- Resend will show "Pending" → "Verified" when ready
- You'll receive an email when verification is complete

### 1.4 Test Email Sending (Optional but Recommended)

1. Go to **"Emails"** → **"Send Test Email"**
2. Enter your email address
3. Click **"Send"**
4. Check your inbox - you should receive a test email

**✅ You now have:**
- `RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 2: Get Contact Information

### 2.1 David's Email Address

**What you need:** David's business email address

**Your Setup:**
- Business email: `solutions@applicreations.com` (Hostinger)
- Personal email: `david1984moore@gmail.com` (Gmail)
- Forwarding: Hostinger forwards `solutions@applicreations.com` → `david1984moore@gmail.com`
- Gmail alias: You can send/reply as `solutions@applicreations.com` from Gmail

**For Environment Variables:**
- Use: `solutions@applicreations.com` (professional business email)
- ✅ This is what clients will see
- ✅ Emails sent to this address will forward to your Gmail automatically
- ✅ You can reply from Gmail using your alias

**✅ You now have:**
- `DAVID_EMAIL=solutions@applicreations.com`
- `NEXT_PUBLIC_DAVID_EMAIL=solutions@applicreations.com` (same value)

**Note:** Even though emails forward to `david1984moore@gmail.com`, use `solutions@applicreations.com` in the environment variables so clients see your professional email address.

### 2.2 David's Phone Number

**What you need:** David's business phone number

**Format:** Use a readable format like `(555) 123-4567` or `555-123-4567`

**✅ You now have:**
- `DAVID_PHONE=(555) 123-4567`
- `NEXT_PUBLIC_DAVID_PHONE=(555) 123-4567` (same value)

### 2.3 Calendly URL

**What you need:** Your Calendly scheduling link

**If you don't have Calendly:**

1. Go to **https://calendly.com**
2. Sign up for a free account
3. Create a new event type:
   - Name: "Project Consultation"
   - Duration: 30 minutes (or your preference)
   - Description: "Schedule a call to discuss your project"
4. Set your availability
5. Copy your Calendly link (looks like: `https://calendly.com/your-username/event-name`)

**If you already have Calendly:**
- Copy your existing Calendly link

**✅ You now have:**
- `DAVID_CALENDLY_URL=https://calendly.com/applicreations`
- `NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/applicreations` (same value)

---

## Step 3: Set Up Email Sender Address

### 3.1 Choose Your Sender Email

**What you need:** The email address that will appear as the sender

**Important:** The domain in this email address must match the domain you verified in Step 1.3.

**Options:**

1. **For Testing/Development (No Domain Verification Needed):**
   - Use: `onboarding@resend.dev`
   - ✅ Works immediately, no setup required
   - ⚠️ Shows "via resend.dev" in email clients
   - ✅ Perfect for development and testing
   - Set: `INTROSPECT_FROM_EMAIL=Introspect <onboarding@resend.dev>`

2. **For Production (Requires Domain Verification):**
   - Use: `introspect@applicreations.com`
   - ✅ Professional appearance
   - ✅ No "via resend.dev" notice
   - ⚠️ Requires `applicreations.com` to be verified in Resend (Step 1.3)
   - Set: `INTROSPECT_FROM_EMAIL=Introspect <introspect@applicreations.com>`

**Development vs Production Setup:**

**Development (Right Now):**
```bash
# Use Resend's test domain - works immediately
INTROSPECT_FROM_EMAIL=Introspect <onboarding@resend.dev>
```
- ✅ No domain verification needed
- ✅ Works immediately
- ✅ Perfect for testing
- ⚠️ Emails show "via resend.dev"
- ✅ Recipients will receive emails (including forwarded to your Gmail)

**Production (When Live):**
```bash
# Use your verified domain - professional
# Options:
# Option 1: Use introspect@applicreations.com (recommended)
INTROSPECT_FROM_EMAIL=Introspect <introspect@applicreations.com>

# Option 2: Use solutions@applicreations.com (if you prefer)
INTROSPECT_FROM_EMAIL=Introspect <solutions@applicreations.com>
```
- ✅ Professional appearance
- ✅ Requires domain verification (`applicreations.com` in Resend)
- ✅ No "via resend.dev" notice
- ✅ Emails sent to clients will appear from your domain

**Important Note About Your Email Setup:**
- Resend sends emails **directly** to recipients (doesn't use Hostinger email)
- Your Hostinger forwarding (`solutions@applicreations.com` → `david1984moore@gmail.com`) doesn't affect Resend
- Resend just needs the domain (`applicreations.com`) verified to send FROM that domain
- Recipients receive emails directly from Resend's servers, not through Hostinger

**✅ You now have:**
- For development: `INTROSPECT_FROM_EMAIL=Introspect <onboarding@resend.dev>`
- For production: `INTROSPECT_FROM_EMAIL=Introspect <introspect@applicreations.com>`

**Format Note:** The format `Name <email@domain.com>` is optional but recommended for better display.

---

## Step 4: Create `.env.local` File

### 4.1 Locate Your Project Root

Your `.env.local` file should be in the root of your project:
```
C:\Users\david\Projects\Introspect\.env.local
```

### 4.2 Create the File

1. Open your project in your code editor
2. In the root directory (same level as `package.json`), create a new file named `.env.local`
3. If the file already exists, open it

### 4.3 Add All Environment Variables

Copy and paste this template, replacing with your actual values:

```bash
# ============================================
# Email Service (Resend)
# ============================================
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email sender address (must match verified domain in Resend)
# Format: "Display Name <email@domain.com>"
INTROSPECT_FROM_EMAIL=Introspect <introspect@applicreations.com>

# ============================================
# Contact Information (Server-side)
# ============================================
# David's email address (use your business email)
DAVID_EMAIL=solutions@applicreations.com

# David's phone number (any format)
DAVID_PHONE=(555) 123-4567

# Calendly scheduling URL
DAVID_CALENDLY_URL=https://calendly.com/applicreations

# ============================================
# Contact Information (Client-side)
# ============================================
# These are exposed to the browser, so use the same values
# but with NEXT_PUBLIC_ prefix
NEXT_PUBLIC_DAVID_EMAIL=solutions@applicreations.com
NEXT_PUBLIC_DAVID_PHONE=(555) 123-4567
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/applicreations

# ============================================
# Optional Configuration
# ============================================
# Base URL for PDF generation (defaults to http://localhost:3000)
# Only change if your API is hosted elsewhere
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4.4 Replace Placeholder Values

Replace these placeholders with your actual values:

- `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Your actual Resend API key
- `introspect@applicreations.com` → Your verified sender email (or `onboarding@resend.dev` for testing)
- `solutions@applicreations.com` → Your business email (this is what clients will see)
- `(555) 123-4567` → Your actual phone number
- `https://calendly.com/applicreations` → Your actual Calendly URL

**Note:** Even though `solutions@applicreations.com` forwards to your Gmail, use the business email address in the environment variables for a professional appearance.

### 4.5 Save the File

- Save the `.env.local` file
- Make sure it's in the root directory
- **Important:** Never commit this file to Git (it should be in `.gitignore`)

---

## Step 5: Verify Setup

### 5.1 Check File Location

Your `.env.local` should be here:
```
Introspect/
├── .env.local          ← Should be here
├── package.json
├── next.config.mjs
└── src/
```

### 5.2 Restart Development Server

1. Stop your current dev server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```
3. Environment variables are loaded on server start

### 5.3 Test Email Configuration

**For Development (Using onboarding@resend.dev):**
- ✅ Emails will work immediately without domain verification
- ✅ Perfect for testing the complete flow
- ⚠️ Emails will show "via resend.dev" in the sender line
- ✅ This is expected and fine for development

**For Production (Using introspect@applicreations.com):**
- ⚠️ Requires domain verification first (Step 1.3)
- ✅ Professional appearance
- ✅ No "via resend.dev" notice

**How to test:**

1. Complete a conversation in Introspect
2. When completion flow triggers, check:
   - Console logs for email sending status
   - Your email inbox for the client summary
   - David's email for the SCOPE.md

**Note:** If using `onboarding@resend.dev` for testing, emails will work immediately. You can switch to your verified domain later for production.

### 5.4 Common Issues

**"RESEND_API_KEY not configured"**
- Check that `.env.local` exists in root directory
- Verify API key is correct (starts with `re_`)
- Restart dev server after adding variables

**"Domain not verified"**
- Check Resend dashboard → Domains
- Verify DNS records are added correctly
- Wait for DNS propagation (can take up to 48 hours)

**"Emails not sending"**
- Check Resend dashboard → Emails for error messages
- Verify sender email matches verified domain
- Check spam folder

---

## Step 6: Production Deployment

### 6.1 Add to Hosting Platform

When deploying to production (Vercel, Netlify, etc.):

**Vercel:**
1. Go to your project settings
2. Click **"Environment Variables"**
3. Add each variable one by one
4. Select environment: **Production**, **Preview**, **Development**
5. Redeploy

**Netlify:**
1. Go to Site settings → Environment variables
2. Add each variable
3. Redeploy

**Other Platforms:**
- Add environment variables in your hosting platform's dashboard
- Use the same variable names and values

### 6.2 Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ Never commit API keys to Git
- ✅ Use different API keys for development/production
- ✅ Rotate API keys periodically
- ✅ Monitor Resend dashboard for suspicious activity

---

## Quick Reference Checklist

Use this checklist to ensure you have everything:

- [ ] Resend account created
- [ ] Resend API key obtained (`re_...`)
- [ ] Domain verified in Resend
- [ ] DNS records added (SPF, DKIM)
- [ ] David's email address
- [ ] David's phone number
- [ ] Calendly URL created/obtained
- [ ] Sender email address chosen
- [ ] `.env.local` file created
- [ ] All variables added to `.env.local`
- [ ] Dev server restarted
- [ ] Test email sent successfully

---

## Need Help?

**Resend Support:**
- Documentation: https://resend.com/docs
- Support: support@resend.com

**Common Questions:**

**Q: Can I use Gmail for sending emails?**
A: No, you need a transactional email service like Resend. Gmail has strict sending limits.

**Q: Do I need to verify my domain?**
A: Only for production. For development/testing, use `onboarding@resend.dev` which works immediately without verification. Domain verification is needed to send from your own domain (like `introspect@applicreations.com`) which looks more professional.

**Q: Does the verified domain need to match where Introspect is hosted?**
A: No! Domain verification is only for EMAIL sending. Your website can be hosted anywhere:
- `applicreations.com/introspect` ✅
- `introspect.applicreations.com` ✅  
- `introspect.com` ✅
- Any domain ✅

The email domain (`applicreations.com`) and website domain can be completely different.

**Q: How much does Resend cost?**
A: Free tier: 3,000 emails/month. Paid plans start at $20/month for 50,000 emails.

**Q: Can I use a different email service?**
A: Yes, but you'll need to modify `emailService.ts` to use a different provider (SendGrid, Mailgun, etc.).

---

## Summary

You need these 8 environment variables:

1. `RESEND_API_KEY` - From Resend dashboard
2. `INTROSPECT_FROM_EMAIL` - Your sender email
   - **Development:** `Introspect <onboarding@resend.dev>` (works immediately, no verification needed)
   - **Production:** `Introspect <introspect@applicreations.com>` or `Introspect <solutions@applicreations.com>` (requires domain verification)
3. `DAVID_EMAIL` - Your business email (`solutions@applicreations.com`)
4. `DAVID_PHONE` - Your phone number
5. `DAVID_CALENDLY_URL` - Calendly link
6. `NEXT_PUBLIC_DAVID_EMAIL` - Same as DAVID_EMAIL (`solutions@applicreations.com`)
7. `NEXT_PUBLIC_DAVID_PHONE` - Same as DAVID_PHONE
8. `NEXT_PUBLIC_CALENDLY_URL` - Same as DAVID_CALENDLY_URL

**Quick Start for Development:**
- Use `onboarding@resend.dev` for `INTROSPECT_FROM_EMAIL`
- No domain verification needed
- Emails work immediately
- Perfect for testing

**When Ready for Production:**
- Verify `applicreations.com` in Resend
- Change `INTROSPECT_FROM_EMAIL` to `introspect@applicreations.com`
- Professional appearance, no "via resend.dev" notice

Once all are set, Phase 10 email delivery will work! 🎉

---

## Key Concept: Email Domain vs Website Domain

**Email Domain (Resend Verification):**
- This is the domain in your email address: `introspect@applicreations.com`
- You verify `applicreations.com` in Resend
- This allows you to send emails FROM that domain
- **This has nothing to do with where Introspect is hosted**

**Website Domain (Where Introspect Lives):**
- Could be: `applicreations.com/introspect`
- Could be: `introspect.applicreations.com`
- Could be: `introspect.com`
- **This can be completely different from the email domain**

**Example:**
- Email domain: `applicreations.com` (verified in Resend)
- Website domain: `introspect.applicreations.com` (where Introspect is hosted)
- ✅ This works perfectly! They don't need to match.

