# AngleLab — Cloud Architecture

## Why Cloud?
- Traffic variability (10 req/day or 10,000 req/day)
- Zero ops overhead (focus on product, not servers)
- Cost optimized (pay for what you use)

## Architecture Overview

| Layer | Service | Role |
|---|---|---|
| Frontend | CloudFront | Serves static Next.js assets globally |
| Business Logic | Lambda | Orchestrator + Phase 2 Pipeline (stateless) |
| Database | RDS (PostgreSQL) | Ideas per user, structured queries |
| Caching | ElastiCache Redis | Ideas per angle, TTL 24h |
| File Storage | S3 + Lambda | CSV upload → async processing → RDS |

## Component Decisions

### Frontend — CloudFront
Why: Next.js produces static assets (HTML/CSS/JS).
CloudFront serves them globally from edge locations.
Trade-off: zero server management vs limited customization control.

### Business Logic — Lambda
Why: Orchestrator is stateless, 150ms per execution, variable traffic.
Lambda scales automatically, cost per execution (no idle server 24/7).
Trade-off: cost optimal vs cold start latency (100-300ms first request).

### Database — RDS (PostgreSQL)
Why: Relations between users and ideas, filtered queries, critical consistency.
Managed — zero patching, automatic backups, Multi-AZ ready.
Trade-off: fast production setup vs limited control vs DynamoDB massive scale.

### Caching — ElastiCache Redis
Why: Ideas per angle are identical for all users.
TTL 24h — static data, rare changes, zero stampede risk.
Trade-off: 24h stale data acceptable (ideas do not change frequently).

### File Storage — S3
Why: CSV uploads (binary files, not structured data).
S3 event triggers Lambda async — zero polling, zero manual intervention.
Trade-off: eventual consistency acceptable for async processing.

## What Would Change in Production
- Multi-AZ RDS for availability (99.9% SLA)
- CloudFront WAF for security (rate limiting, DDoS protection)
- Lambda concurrency limits configured (cost control)
- Observability: CloudWatch metrics + traces per Lambda execution