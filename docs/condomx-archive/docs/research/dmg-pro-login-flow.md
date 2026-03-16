# DMG Pro Login Flow — Technical Specification

> **Milestone**: M4 — DMG Pro Reverse Engineering
> **Author**: agent:eyes (E1)
> **Date**: 2026-03-06
> **Status**: ⚠️ HYPOTHESIS — Requires live verification
> **Verification Status**: [UNVERIFIED] — No live browser access yet

---

## ⚠️ IMPORTANT: Verification Status

**All API endpoints, response formats, and selectors in this document are [UNVERIFIED]** — they are:
- Educated guesses based on common authentication patterns
- Inferred from Phase 1 research intelligence
- **NOT** captured from live DMG Pro traffic

**BLOCKER**: No live browser access or traffic capture yet.

**To Verify** (Phase 2 implementation):
1. Login to DMG Pro with real credentials
2. Capture actual HTTP requests/responses via browser DevTools Network tab
3. Verify SMS code expiry time (documented as ~20s, needs confirmation)
4. Document actual cookie names and expiry
5. Update this document with [VERIFIED] data
6. Mark [INCORRECT] any wrong assumptions

---

## Overview

DMG Pro uses SMS-based 2FA authentication with short-lived codes. This document details the complete login flow for automation purposes.

**Key Constraints**:
- SMS codes expire in ~20 seconds (critical timing) **[UNVERIFIED]**
- Only ONE active session per account (concurrent logins cause logout) **[UNVERIFIED]**
- Sequential account access required for multi-account operations
- Session cookies valid for ~24 hours **[UNVERIFIED]**

---

## Authentication Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│  login.dmg   │────▶│  SMS Gateway │
│  (Nodriver)  │◀────│   pro.com    │◀────│  (Twilio)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│   Session    │     │   Control    │
│   Cookies    │     │   Center     │
└──────────────┘     └──────────────┘
```

---

## Step-by-Step Flow

### Step 1: Navigate to Login

```
URL: https://login.dmgpro.com/login
Method: GET
Headers:
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
  Accept-Language: en-US,en;q=0.5
```

**Expected Response**:
- Status: 200 OK
- Content-Type: text/html
- Body: Login form with phone input

**Automation Code**:
```typescript
const page = await browser.newPage();
await page.goto('https://login.dmgpro.com/login', { waitUntil: 'networkidle0' });

// Verify login page loaded
const phoneInput = await page.$('input[name="phone"]');
if (!phoneInput) throw new Error('Login page did not load correctly');
```

---

### Step 2: Submit Phone Number

```
URL: https://login.dmgpro.com/login/send-code
Method: POST
Content-Type: application/x-www-form-urlencoded

Form Data:
  phone: +1XXXXXXXXXX  (E.164 format)
  action: send_code
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Verification code sent",
  "code_expires_in": 20,
  "masked_phone": "***-***-1234"
}
```

**Automation Code**:
```typescript
// Fill phone number
const phoneInput = await page.$('input[name="phone"]');
await phoneInput.type('+15551234567');

// Click send code button
const sendButton = await page.$('button[type="submit"]');
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
  sendButton.click()
]);

// Start timer - code expires in 20 seconds!
const codeExpiryTimer = setTimeout(() => {
  console.warn('SMS code about to expire - need to hurry');
}, 15000);
```

---

### Step 3: Receive SMS Code (Parallel Track)

**SMS Format**:
```
From: DMG Pro <noreply@dmgpro.com>
Body: "Your DMG Pro verification code is: 123456. Expires in 20 seconds."
```

**Twilio Webhook Integration**:
```typescript
// Set up webhook listener BEFORE initiating login
let verificationCode: string | null = null;

app.post('/sms-webhook', express.raw({ type: 'application/x-www-form-urlencoded' }), (req, res) => {
  const body = new URLSearchParams(req.body.toString());
  const from = body.get('From');
  const messageBody = body.get('Body');
  
  if (from.includes('DMG') || from.includes('dmgpro')) {
    const codeMatch = messageBody.match(/code is: (\d{6})/);
    if (codeMatch) {
      verificationCode = codeMatch[1];
      console.log('Received DMG verification code');
    }
  }
  
  res.status(200).send('OK');
});
```

**Alternative: Phone Audio Capture** (if Twilio not linked to DMG account):
```typescript
// Use audio transcription to capture SMS read-aloud
// Implementation depends on phone hardware integration
```

---

### Step 4: Submit Verification Code

```
URL: https://login.dmgpro.com/login/verify
Method: POST
Content-Type: application/x-www-form-urlencoded

Form Data:
  code: 123456
  phone: +1XXXXXXXXXX
  session_token: [from step 2 response]
```

**Expected Response**:
```json
{
  "success": true,
  "redirect_url": "https://controlcenter.dmgpro.com/dashboard",
  "session": {
    "cookie": "DMG_SESSION_ID=abc123...",
    "expires": "2026-03-07T04:30:00Z"
  }
}
```

**Automation Code**:
```typescript
// Wait for code to arrive (poll with timeout)
const code = await waitForCode(() => verificationCode, { timeout: 18000 });

if (!code) {
  throw new Error('SMS code expired or not received');
}

// Enter code
const codeInput = await page.$('input[name="code"]');
await codeInput.type(code);

// Submit
const verifyButton = await page.$('button[type="submit"]');
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
  verifyButton.click()
]);

// Verify successful login
const currentUrl = page.url();
if (currentUrl.includes('/dashboard') || currentUrl.includes('controlcenter')) {
  console.log('Login successful');
} else {
  throw new Error('Login failed - unexpected redirect');
}
```

---

### Step 5: Session Persistence

**Cookies to Save**:
```javascript
const cookies = await page.cookies();
const sessionCookies = cookies.filter(c => 
  c.name.includes('DMG') || c.name.includes('session')
);

// Save to secure storage
await saveSessionCookies(accountId, sessionCookies);
```

**Cookie Details**:
| Name | Domain | Expires | Purpose |
|------|--------|---------|---------|
| `DMG_SESSION_ID` | .dmgpro.com | 24h | Session identifier |
| `DMG_ACCOUNT_ID` | .dmgpro.com | 24h | Active account |
| `DMG_AUTH_TOKEN` | .dmgpro.com | 24h | Auth token |
| `__cfduid` | .dmgpro.com | 30d | Cloudflare (if present) |

**LocalStorage**:
```javascript
const localStorage = await page.evaluate(() => {
  return {
    dmg_user_prefs: localStorage.getItem('dmg_user_prefs'),
    dmg_last_account: localStorage.getItem('dmg_last_account')
  };
});
```

---

## Session Management

### Multi-Account Strategy

**Constraint**: Only ONE active session per account at a time.

**Solution**: Sequential access with session reuse

```typescript
class DMGSessionManager {
  private sessions: Map<string, SessionData> = new Map();
  private activeSession: string | null = null;
  
  async login(accountId: string): Promise<Page> {
    // Check if we have a valid saved session
    const savedSession = this.sessions.get(accountId);
    if (savedSession && !this.isExpired(savedSession)) {
      return this.restoreSession(savedSession);
    }
    
    // Need to perform fresh login
    return this.freshLogin(accountId);
  }
  
  async switchAccount(fromId: string, toId: string): Promise<void> {
    // Save current session state
    await this.saveSession(fromId);
    
    // Switch account via dropdown (faster than re-login)
    if (this.activeSession === fromId) {
      await this.selectAccountDropdown(toId);
      this.activeSession = toId;
    }
  }
  
  private async selectAccountDropdown(accountId: string): Promise<void> {
    const accountSelect = await this.page.$('select[name="account"]');
    await accountSelect.select(accountId);
    await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
  }
}
```

### Session Health Check

```typescript
async function verifySession(page: Page): Promise<boolean> {
  try {
    // Try to access a protected page
    await page.goto('https://controlcenter.dmgpro.com/api/health', {
      waitUntil: 'domcontentloaded',
      timeout: 5000
    });
    
    const status = await page.evaluate(() => document.body.innerText);
    return status.includes('ok') || status.includes('authenticated');
  } catch (error) {
    // Session expired or invalid
    return false;
  }
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Recovery |
|-------|-------|----------|
| "Invalid code" | Code expired (>20s) | Request new code, retry |
| "Session expired" | Cookie expired (>24h) | Re-login |
| "Account locked" | Too many failed attempts | Wait 15 min, then retry |
| "Concurrent session" | Another login active | Wait for other session to timeout |
| CAPTCHA | Suspicious activity | Manual intervention required |

### Retry Logic

```typescript
async function loginWithRetry(accountId: string, maxRetries = 3): Promise<SessionData> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await login(accountId);
    } catch (error) {
      lastError = error;
      
      if (error.message.includes('expired')) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await sleep(delay);
        continue;
      }
      
      if (error.message.includes('locked')) {
        throw new Error('Account locked - manual intervention required');
      }
    }
  }
  
  throw lastError;
}
```

---

## Implementation Checklist

- [ ] Set up Twilio webhook for SMS code reception
- [ ] Implement Nodriver login script
- [ ] Add session persistence (cookies + localStorage)
- [ ] Build session manager for multi-account support
- [ ] Add session health check (periodic verification)
- [ ] Implement retry logic with exponential backoff
- [ ] Add error handling for all known error cases
- [ ] Test with all 14 accounts sequentially
- [ ] Document session timeout patterns

---

## Security Notes

- Store session cookies encrypted at rest
- Never log SMS codes or auth tokens
- Use secure storage (keychain, encrypted file)
- Rotate sessions periodically (don't wait for expiry)
- Monitor for session hijacking (unexpected logouts)

---

**Next Steps**:
1. Test login flow with actual DMG Pro credentials
2. Measure actual code expiry time (may be >20s)
3. Document any CAPTCHA or bot detection triggers
4. Test session persistence across browser restarts
