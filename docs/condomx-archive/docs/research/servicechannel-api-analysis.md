# ServiceChannel API Analysis

> **Milestone**: M2 (Competitive Intelligence)  
> **Agent**: agent:research (E1)  
> **Status**: IN PROGRESS  
> **Started**: 2026-03-06T05:00Z  
> **API Documentation**: https://developer.servicechannel.com  
> **Constitution Reference**: QANAT Principle I (Money First), IV (Escalate, Don't Fail)

---

## Executive Summary

**ServiceChannel** is a leading facility management platform with **60,000+ service professionals** on its network. Unlike DMG Pro, ServiceChannel offers a **public REST API + webhooks** — making it significantly more automation-friendly.

**Key Intelligence**:
- API Version: v2.0 (current as of 2026-03)
- Authentication: OAuth 2.0
- Rate Limits: [TO BE CONFIRMED]
- Webhook Support: Yes (work order events, status changes)
- Sandbox Environment: Available

**Strategic Implication for CondomX**:
1. ServiceChannel represents the "API-first" approach vs DMG Pro's "walled garden"
2. If we expand beyond DMG Pro, ServiceChannel is the easiest integration target
3. Their API design informs industry standards for work order schemas

---

## API Endpoints Analysis

### Authentication
```
POST /oauth/token
Grant Type: client_credentials
Scope: work_orders:read work_orders:write providers:read
```

**Our Implementation Notes**:
- OAuth 2.0 is standard — use existing libraries
- Token refresh logic required (typical expiry: 1 hour)
- ServiceChannel supports multiple API keys per account

### Work Orders

#### GET /work_orders
Retrieve work orders with filtering.

**Query Parameters**:
- `status` — pending, accepted, in_progress, completed, cancelled
- `property_id` — filter by property
- `created_after` — ISO 8601 timestamp
- `trade` — HVAC, plumbing, electrical, etc.

**Response Schema** (simplified):
```json
{
  "id": "wo_123456",
  "property_id": "prop_789",
  "trade": "plumbing",
  "description": "Fix leaking faucet",
  "nte_amount": 250.00,
  "status": "pending",
  "created_at": "2026-03-06T04:00:00Z",
  "due_by": "2026-03-08T17:00:00Z",
  "address": {
    "street": "123 Main St",
    "city": "Phoenix",
    "state": "AZ",
    "zip": "85001"
  },
  "contact": {
    "name": "John Doe",
    "phone": "+15555550123"
  }
}
```

**CondomX Mapping**:
- `nte_amount` → our profitability calculator input
- `trade` → technician matching criterion
- `due_by` → urgency scoring factor
- `address` → H3 zone geospatial lookup

#### POST /work_orders/{id}/accept
Accept a work order.

**Request**:
```json
{
  "provider_id": "prov_456",
  "estimated_arrival": "2026-03-06T10:00:00Z"
}
```

**Our Implementation**:
- This is what we automate after profitability analysis
- ETA calculation based on technician location + traffic

#### POST /work_orders/{id}/complete
Mark work order complete with invoice.

**Request**:
```json
{
  "completed_at": "2026-03-06T11:30:00Z",
  "invoice_amount": 225.00,
  "invoice_url": "https://...",
  "notes": "Replaced faucet cartridge"
}
```

**CondomX Integration**:
- Invoice submission automation
- Amount validation vs NTE (flag overages)

### Providers (Technicians)

#### GET /providers
List service providers/technicians.

**Response**:
```json
{
  "id": "prov_456",
  "name": "ABC Plumbing",
  "trades": ["plumbing"],
  "service_areas": [
    {
      "state": "AZ",
      "zip_codes": ["85001", "85002", "85003"]
    }
  ],
  "rating": 4.8,
  "completion_rate": 0.97
}
```

**Our Scoring System Comparison**:
- ServiceChannel: rating + completion_rate (simple)
- CondomX: multi-factor composite (reliability, quality, speed, price, responsiveness) — **more sophisticated**

#### POST /providers
Onboard new provider.

**Request**:
```json
{
  "name": "ABC Plumbing",
  "email": "dispatch@abcplumbing.com",
  "phone": "+15555550123",
  "trades": ["plumbing"],
  "service_areas": [...],
  "insurance_expiry": "2026-12-31",
  "license_number": "ROC123456"
}
```

**CondomX Automation Opportunity**:
- We can auto-onboard technicians via API
- Insurance/license expiry monitoring (QANAT Principle VII)

### Properties

#### GET /properties
List properties under management.

**Strategic Value**:
- Property history → predict recurring work orders
- Location clustering → optimize technician routing

---

## Webhook Events

ServiceChannel pushes real-time events:

| Event | Trigger | Our Use Case |
|-------|---------|--------------|
| `work_order.created` | New WO posted | Instant detection (<60s per QANAT) |
| `work_order.accepted` | Provider accepts | Track competitor behavior |
| `work_order.completed` | Job finished | Completion rate monitoring |
| `work_order.cancelled` | Job cancelled | Learn cancellation patterns |
| `provider.rating_changed` | Rating updated | Tech scoring updates |

**Webhook Payload** (example):
```json
{
  "event": "work_order.created",
  "timestamp": "2026-03-06T04:00:00Z",
  "data": {
    "work_order_id": "wo_123456",
    "property_id": "prop_789",
    "trade": "plumbing"
  }
}
```

**CondomX Implementation**:
- Webhook listener endpoint (Fastify/Hono)
- Event queue for processing (BullMQ/Redis)
- Idempotency handling (retry safety)

---

## Rate Limits & Quotas

[TO BE CONFIRMED — requires API testing]

**Typical Industry Standards**:
- 100 requests/minute per API key
- 10,000 requests/day
- Webhook: unlimited (push model)

**Our Strategy**:
- Implement rate limit backoff
- Cache frequently-accessed data (properties, providers)
- Use webhooks over polling where available

---

## Competitive Intelligence

### ServiceChannel + AI (Titan Intelligence)
From autonomous-dispatch-landscape.md:
- **AI in Beta**: Flags miscoded trades, low NTEs, multi-visit risks
- **Dispatch Board**: Visual assignment interface
- **No autonomous dispatch** — still requires human dispatchers

**CondomX Advantage**:
- We're building **fully autonomous** (Level 5) dispatch
- ServiceChannel AI is **assistant-only** (Level 2-3)
- Their API-first approach makes them easier to integrate with, but also means they're dependent on provider API adoption

### Network Size
- **60,000+ service professionals** (from docs)
- **130+ trades** supported
- **Enterprise customers**: Target, Walmart, Starbucks (assumed)

**CondomX Strategy**:
- Can't compete on network size initially
- Compete on **speed** (5-min dispatch vs 30-min human)
- Compete on **margin** (AI negotiation vs human rate acceptance)

---

## Integration Priority for CondomX

| Priority | Platform | Reason | Effort |
|----------|----------|--------|--------|
| P0 | DMG Pro | Revenue now (14 accounts ready) | High (browser automation) |
| P1 | ServiceChannel | Expansion path, API-easy | Low (REST API) |
| P2 | Corrigo (JLL) | Large network, REST API | Low-Medium |
| P3 | FacilitySource | Walled garden (like DMG) | High |
| P4 | MaintenX | Walled garden | High |

**Recommendation**: Build DMG Pro automation first (M4), then ServiceChannel integration as expansion lane (post-MVP).

---

## Next Steps

1. [ ] Create ServiceChannel developer account
2. [ ] Test API endpoints in sandbox
3. [ ] Measure actual rate limits
4. [ ] Build webhook listener prototype
5. [ ] Map ServiceChannel WO schema to CondomX internal schema
6. [ ] Estimate integration effort (days)

---

**Last Updated**: 2026-03-06T05:00Z  
**Agent**: agent:research  
**Next Review**: After sandbox API testing
