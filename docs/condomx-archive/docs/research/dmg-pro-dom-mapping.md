# DMG Pro Control Center — DOM Mapping

> **Milestone**: M4 — DMG Pro Reverse Engineering
> **Author**: agent:eyes (E1)
> **Date**: 2026-03-06
> **Status**: ⚠️ HYPOTHESIS — Requires live verification
> **Target URL**: `https://controlcenter.dmgpro.com`
> **Verification Status**: [UNVERIFIED] — No live browser access yet

---

## ⚠️ IMPORTANT: Verification Status

**All selectors in this document are [UNVERIFIED]** — they are educated guesses based on:
- Common web form patterns
- Standard HTML conventions
- Phase 1 research intelligence

**BLOCKER**: No live browser access to DMG Pro Control Center yet.

**To Verify** (Phase 2 implementation):
1. Login to controlcenter.dmgpro.com with real credentials
2. Use browser DevTools to capture actual selectors
3. Screenshot key pages for reference
4. Update this document with [VERIFIED] selectors
5. Remove or mark [INCORRECT] any wrong selectors

---

## Overview

This document maps the complete DOM structure of DMG Pro Control Center for browser automation. All selectors use stable attributes (data-testid, id, name) where available, with fallback CSS selectors.

**Automation Tool**: Nodriver (stealth, async, no detectable automation signals)
**Session Model**: One session per account, sequential access only

---

## Authentication Flow

### 1. Login Page (`/login`)

```
URL: https://login.dmgpro.com/login
Method: POST
Form ID: loginForm

Selectors:
- Phone input:      input[name="phone"], input[type="tel"]
- Submit button:    button[type="submit"], input[value*="Send Code"]
- Error message:    .error-message, .alert-danger
- Help link:        a[href*="zendesk.com"]
```

**Flow**:
1. Enter phone number (E.164 format: +1XXXXXXXXXX)
2. Click "Send Code"
3. SMS code sent to admin phone
4. Code expires in ~20 seconds
5. Redirect to Control Center on success

### 2. SMS Code Verification (`/verify`)

```
URL: https://login.dmgpro.com/verify
Method: POST

Selectors:
- Code input:       input[name="code"], input[type="text"][maxlength="6"]
- Verify button:    button[type="submit"], input[value*="Verify"]
- Resend link:      a[href*="resend"], button:contains("Resend Code")
- Error message:    .error-message, .alert-warning
```

**Session Persistence**:
- Cookie: `DMG_SESSION_ID` (expires: 24 hours)
- Cookie: `DMG_ACCOUNT_ID` (multi-account switching)
- LocalStorage: `dmg_user_prefs`

---

## Control Center — Main Dashboard

### 3. Dashboard Home (`/dashboard` or `/`)

```
URL: https://controlcenter.dmgpro.com/dashboard

Key Sections:
┌─────────────────────────────────────────────────────────────┐
│ [Header] Logo | Account Switcher | User Menu | Notifications│
├──────────────┬──────────────────────────────────────────────┤
│ [Sidebar]    │ [Main Content Area]                          │
│ - Jobs       │ - Work Order Cards / List View               │
│ - Invoices   │ - Status Filters (Open, In Progress, etc.)   │
│ - Reports    │ - Quick Stats (Pending, Accepted, Completed) │
│ - Settings   │ - Recent Activity Feed                       │
│ - Help       │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

**Selectors**:
```javascript
// Header
header:                     header, .header-bar
account-switcher:           select[name="account"], .account-dropdown
user-menu:                  .user-menu, [data-testid="user-menu"]
notification-badge:         .notification-badge, .badge-notify

// Sidebar Navigation
nav:                        nav, .sidebar, .main-nav
nav-jobs:                   a[href*="/jobs"], .nav-item:contains("Jobs")
nav-invoices:               a[href*="/invoices"], .nav-item:contains("Invoices")
nav-reports:                a[href*="/reports"], .nav-item:contains("Reports")
nav-settings:               a[href*="/settings"], .nav-item:contains("Settings")

// Main Content
content-area:               main, .content-area, #main-content
job-cards:                  .job-card, [data-testid="job-card"]
job-card-title:             .job-card h3, .job-title
job-card-status:            .status-badge, .job-status
job-card-location:          .location, .job-address
job-card-nTE:               .nte-amount, [data-testid="nte"]

// Filters
filter-status:              select[name="status"], .filter-status
filter-date:                input[type="date"], .date-filter
filter-trade:               select[name="trade"], .filter-trade
apply-filter:               button:contains("Apply"), .filter-btn
```

---

## Work Order Management

### 4. Jobs List (`/jobs`)

```
URL: https://controlcenter.dmgpro.com/jobs

Query Params:
- status: open|accepted|in-progress|completed|cancelled
- trade: hvac|plumbing|electrical|locksmith|handyman|janitorial
- date-from: YYYY-MM-DD
- date-to: YYYY-MM-DD
- page: number
```

**Work Order Card Structure**:
```html
<div class="job-card" data-job-id="12345">
  <div class="job-header">
    <h3 class="job-title">HVAC Repair - Store #1234</h3>
    <span class="status-badge status-open">Open</span>
  </div>
  <div class="job-details">
    <div class="location">123 Main St, City, ST 12345</div>
    <div class="trade">HVAC</div>
    <div class="nte">NTE: $500.00</div>
    <div class="posted-date">Posted: 2026-03-06 10:30 AM</div>
  </div>
  <div class="job-actions">
    <button class="btn-accept">Accept</button>
    <button class="btn-decline">Decline</button>
    <button class="btn-view">View Details</button>
  </div>
</div>
```

**Selectors**:
```javascript
// Job List
jobs-container:       .jobs-list, #jobs-container, [data-testid="jobs-list"]
job-card:             .job-card, [data-testid="job-card"]
job-id:               [data-job-id], .job-id

// Job Details (List View)
job-title:            .job-title, h3.job-header
job-status:           .status-badge, .job-status
job-location:         .location, .job-address
job-trade:            .trade, .job-trade
job-nte:              .nte-amount, [data-testid="nte"]
job-posted:           .posted-date, .job-date

// Actions
btn-accept:           .btn-accept, button:contains("Accept")
btn-decline:          .btn-decline, button:contains("Decline")
btn-view:             .btn-view, button:contains("View")
btn-details:          .btn-details, a:contains("Details")
```

### 5. Work Order Details (`/jobs/:id`)

```
URL: https://controlcenter.dmgpro.com/jobs/12345

Sections:
- Job Information (SOW, NTE, Trade, Priority)
- Location Details (Address, Site Contact, Access Instructions)
- Photos/Attachments
- History/Timeline
- Invoice Submission Form
```

**Selectors**:
```javascript
// Job Info Section
job-info:             .job-info, #job-information
sow:                  .sow, .scope-of-work, [data-testid="sow"]
nte-amount:           .nte, [data-testid="nte"]
trade-type:           .trade, .job-trade
priority:             .priority, .urgency-badge

// Location Section
location-info:        .location-info, #location-details
address:              .address, .site-address
site-contact:         .site-contact, .contact-info
access-instructions:  .access-instructions, [data-testid="access"]

// Photos
photos-grid:          .photos-grid, .attachments
photo:                .photo-item, .attachment-thumb
download-link:        a.download, .attachment-download

// Actions
btn-start:            .btn-start-job, button:contains("Start Job")
btn-complete:         .btn-complete, button:contains("Mark Complete")
btn-invoice:          .btn-submit-invoice, button:contains("Submit Invoice")
btn-back:             .btn-back, a:contains("Back to Jobs")
```

### 6. Fast Accept SMS Link

**Critical for speed** — DMG sends SMS with direct accept link for some jobs.

```
Format: https://controlcenter.dmgpro.com/jobs/:id/accept?token=:jwt

Behavior:
- Auto-accepts job without login (token-based auth)
- Token expires: ~15 minutes
- One-time use only
- Redirects to job details after accept
```

**Automation Strategy**:
1. Monitor SMS inbox (Twilio webhook or phone integration)
2. Parse DMG SMS for accept links
3. Click immediately (<5 seconds target)
4. Job auto-accepted, proceed to dispatch

---

## Invoice Submission

### 7. Invoice Form (`/jobs/:id/invoice`)

```
URL: https://controlcenter.dmgpro.com/jobs/12345/invoice

Fields:
- Labor cost
- Materials cost (with receipts upload)
- Subtotal
- Tax (if applicable)
- Total
- Completion notes
- Completion photos upload
```

**Selectors**:
```javascript
// Form Fields
input-labor:          input[name="labor_cost"], #labor-cost
input-materials:      input[name="materials_cost"], #materials-cost
input-subtotal:       input[name="subtotal"], #subtotal
input-tax:            input[name="tax"], #tax-amount
input-total:          input[name="total"], #total-amount
textarea-notes:       textarea[name="notes"], #completion-notes
file-photos:          input[type="file"][name*="photo"], .photo-upload
file-receipts:        input[type="file"][name*="receipt"], .receipt-upload

// Actions
btn-submit:           button[type="submit"], .btn-submit-invoice
btn-save-draft:       button:contains("Save Draft"), .btn-draft
btn-cancel:           button:contains("Cancel"), .btn-cancel
```

---

## Account Management

### 8. Account Switcher

```
Location: Header dropdown
Behavior: Switch between 14 company accounts
```

**Selectors**:
```javascript
account-dropdown:     select[name="account"], .account-switcher
account-option:       option[value], .account-option
current-account:      .current-account, [data-testid="current-account"]
```

**Critical**: Only ONE active session per account. Sequential access required.

---

## Automation Implementation Plan

### Phase 1: DOM Mapping (Current Task)
- [x] Document all selectors and page structure
- [ ] Hands-on verification with real DMG Pro login
- [ ] Capture actual HTML snapshots for reference

### Phase 2: Login Flow Automation
- [ ] Implement SMS code receiver (Twilio webhook)
- [ ] Build Nodriver login script
- [ ] Session persistence to avoid re-login

### Phase 3: Work Order Detection
- [ ] Poll /jobs endpoint every 30 seconds
- [ ] Parse new job cards
- [ ] Extract job data (NTE, trade, location, SOW)
- [ ] Fast-accept SMS link interception

### Phase 4: Auto-Accept & Dispatch
- [ ] Click accept button programmatically
- [ ] Trigger dispatch workflow
- [ ] Update job status in local database

---

## Notes

- **Stealth**: Use Nodriver with stealth plugins, rotate user agents
- **Rate Limits**: Don't poll faster than 30s to avoid detection
- **Session Management**: Store cookies per account, reuse sessions
- **Error Handling**: Detect logout, session expiry, CAPTCHA challenges
- **Fallback**: If DOM changes, use image-based fallback (OCR on screenshots)

---

**Next Steps**:
1. Test selectors against live DMG Pro instance
2. Document actual HTML structure (may differ from estimated)
3. Map mobile app API endpoints (parallel track)
