# Corrigo API Analysis (JLL)

> **Milestone**: M2 (Competitive Intelligence)  
> **Agent**: agent:research (E1)  
> **Status**: IN PROGRESS  
> **Started**: 2026-03-06T05:15Z  
> **API Documentation**: https://corrigopartners.jll.com (provider portal)  
> **Constitution Reference**: QANAT Principle I (Money First), VII (Protect the Accounts)

---

## Executive Summary

**Corrigo** is a facility management platform owned by **JLL (Jones Lang LaSalle)**, one of the largest commercial real estate services firms globally. Unlike DMG Pro, Corrigo offers a **REST API** for integration.

**Key Intelligence**:
- **Owner**: JLL Technologies
- **Network Size**: 60,000+ service professionals (same as ServiceChannel)
- **Trades Supported**: 130+
- **API Type**: REST (provider portal + customer API)
- **Authentication**: [TO BE CONFIRMED — likely OAuth 2.0 or API key]
- **Geographic Coverage**: Global (JLL operates in 80+ countries)

**Strategic Implication for CondomX**:
1. Corrigo represents enterprise-grade facility management (JLL backing)
2. API-first approach enables easier integration than DMG Pro
3. Large provider network = potential technician recruitment channel
4. JLL relationships = enterprise customer acquisition opportunity

---

## Platform Overview

### Corrigo vs Competitors

| Feature | Corrigo (JLL) | ServiceChannel | DMG Pro |
|---------|---------------|----------------|---------|
| API Access | Yes (REST) | Yes (REST + webhooks) | No (walled garden) |
| Network Size | 60K+ providers | 60K+ providers | 16K technicians |
| Owner | JLL (public company) | Independent | Independent |
| Customer Base | Enterprise (Fortune 500) | SMB + Enterprise | SMB (franchise retail) |
| Geographic | Global (80+ countries) | US-focused | US-focused |
| Automation-Friendly | Medium | High | Low (browser automation required) |

### Corrigo Provider Portal

**URL**: https://corrigopartners.jll.com (provider login)

**Key Features**:
- Work order bidding/acceptance
- Invoice submission
- Provider profile management
- Insurance/license tracking
- Performance dashboards

**Automation Opportunities**:
- Work order detection via API (vs browser scraping)
- Automated bid submission
- Invoice automation
- Provider onboarding at scale

---

## API Endpoints (Inferred)

**Note**: Corrigo API documentation is not publicly available. Endpoints below are inferred from industry standards and provider portal behavior.

### Authentication
```
POST /api/oauth/token
Grant Type: client_credentials or password
Scope: workorders:read workorders:write profile:read
```

**Our Implementation Notes**:
- JLL enterprise SSO likely required for API access
- May require partnership agreement for API credentials
- Alternative: browser automation (same as DMG Pro)

### Work Orders

#### GET /api/workorders
Retrieve available work orders for bidding.

**Inferred Query Parameters**:
- `status` — available, bid, awarded, in_progress, completed
- `trade` — HVAC, plumbing, electrical, etc.
- `location` — lat/lng + radius or zip code
- `min_bid_deadline` — filter by time remaining

**Inferred Response Schema**:
```json
{
  "id": "wo_789012",
  "property": {
    "name": "Walgreens Store #1234",
    "address": {
      "street": "456 Oak Ave",
      "city": "Chicago",
      "state": "IL",
      "zip": "60601",
      "country": "US"
    },
    "coordinates": {
      "lat": 41.8781,
      "lng": -87.6298
    }
  },
  "trade": "plumbing",
  "description": "Repair broken toilet in customer restroom",
  "priority": "standard",
  "budget": {
    "nte_amount": 300.00,
    "currency": "USD"
  },
  "bid_deadline": "2026-03-06T18:00:00Z",
  "required_by": "2026-03-08T17:00:00Z",
  "attachments": [
    {
      "type": "image",
      "url": "https://...",
      "description": "Broken toilet photo"
    }
  ],
  "contact": {
    "name": "Store Manager",
    "phone": "+15555550123",
    "email": "store1234@walgreens.com"
  }
}
```

**CondomX Mapping**:
- `budget.nte_amount` → profitability calculator
- `trade` + `location` → technician matching
- `bid_deadline` → urgency scoring (Corrigo uses bidding model vs DMG direct accept)
- `attachments` → LLM vision analysis for scope assessment

#### POST /api/workorders/{id}/bid
Submit a bid for a work order.

**Inferred Request**:
```json
{
  "provider_id": "prov_456",
  "bid_amount": 250.00,
  "estimated_completion": "2026-03-07T14:00:00Z",
  "notes": "Will replace flush valve and inspect supply line"
}
```

**CondomX Automation**:
- AI-powered bid calculation (cost + margin)
- Competitive bid analysis (win rate optimization)
- Auto-bid on high-margin jobs

#### GET /api/workorders/{id}/status
Check work order status.

**Response**:
```json
{
  "id": "wo_789012",
  "status": "awarded",
  "awarded_to": {
    "provider_id": "prov_456",
    "bid_amount": 250.00
  },
  "timeline": [
    {
      "event": "posted",
      "timestamp": "2026-03-06T04:00:00Z"
    },
    {
      "event": "bid_received",
      "timestamp": "2026-03-06T05:30:00Z",
      "provider_id": "prov_456"
    },
    {
      "event": "awarded",
      "timestamp": "2026-03-06T06:00:00Z",
      "provider_id": "prov_456"
    }
  ]
}
```

### Providers

#### GET /api/providers/{id}/performance
Retrieve provider performance metrics.

**Inferred Response**:
```json
{
  "id": "prov_456",
  "rating": 4.7,
  "completion_rate": 0.96,
  "on_time_rate": 0.94,
  "total_jobs": 1247,
  "avg_response_time_hours": 2.3,
  "avg_bid_to_award_ratio": 0.34
}
```

**CondomX Scoring Comparison**:
- Corrigo: standard metrics (rating, completion, on-time)
- CondomX: more granular (reliability, quality, speed, price, responsiveness per trade/zone)

---

## Bidding Model vs Direct Accept

**Corrigo uses a bidding model**:
1. Work order posted
2. Providers submit bids
3. Customer selects winner (price, rating, speed)
4. Winner dispatched

**DMG Pro uses direct accept**:
1. Work order posted
2. First qualified provider to accept wins
3. Speed is the only factor

**CondomX Strategy**:
- **Corrigo lane**: AI-powered bid optimization (win rate vs margin)
  - Analyze historical win rates by bid amount
  - Competitor bid prediction
  - Dynamic margin adjustment
- **DMG Pro lane**: Speed optimization (accept in <30s)

---

## Integration Priority for CondomX

| Priority | Platform | Reason | Effort |
|----------|----------|--------|--------|
| P0 | DMG Pro | Revenue now (14 accounts ready) | High (browser automation) |
| P1 | ServiceChannel | Expansion path, API-easy | Low (REST API) |
| P1 | Corrigo | Enterprise customers, API-available | Low-Medium (REST API, may need partnership) |
| P2 | FacilitySource | Walled garden | High |
| P3 | MaintenX | Walled garden | High |

**Recommendation**: 
- Short-term: Focus on DMG Pro (P0) — immediate revenue
- Medium-term: ServiceChannel + Corrigo (P1) — expansion lanes
- Corrigo may require JLL partnership for API access — explore business development angle

---

## Technician Recruitment Opportunity

Corrigo's 60K+ providers represent a **recruitment channel** for CondomX:

1. **Poach high-performers**: Identify 4.8+ rating, 95%+ completion providers
2. **Multi-platform strategy**: Technicians can work both Corrigo + CondomX
3. **Better economics**: Offer higher margins than Corrigo take rate
4. **Recruitment messaging**: "Keep Corrigo for leads, use CondomX for higher margins"

**Recruitment Flow**:
1. Identify target providers via Corrigo API (public profiles)
2. Outreach via SMS/call (CondomX voice AI)
3. Onboard to CondomX network
4. Dispatch CondomX jobs (higher margin) + Corrigo bids (volume)

---

## Next Steps

1. [ ] Attempt Corrigo provider portal access (create account)
2. [ ] Test API availability (developer portal or contact sales)
3. [ ] If API unavailable: plan browser automation (same as DMG Pro)
4. [ ] Analyze provider profiles for recruitment targeting
5. [ ] Estimate bid optimization model requirements

---

## Competitive Intelligence Gaps

| Question | Priority | Research Method |
|----------|----------|-----------------|
| API documentation availability | High | Developer portal search, sales contact |
| Bidding algorithm (how winners selected) | High | Provider interviews, bid testing |
| Take rate / commission structure | Medium | Provider surveys, terms of service |
| JLL partnership requirements | Medium | Business development outreach |
| Provider churn rate | Low | Provider interviews |

---

**Last Updated**: 2026-03-06T05:15Z  
**Agent**: agent:research  
**Next Review**: After API access testing
