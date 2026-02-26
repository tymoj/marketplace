---
name: rest-api-design
description: REST API design conventions and patterns. Use when creating, modifying, or reviewing API endpoints, DTOs, error responses, or OpenAPI documentation.
user-invocable: false
---

Follow these REST API design conventions:

## URL Naming
- Use kebab-case for URLs: `/api/order-items` not `/api/orderItems`
- Use nouns, not verbs: `/api/orders` not `/api/getOrders`
- Use plural nouns: `/api/orders` not `/api/order`
- Nest sub-resources: `/api/orders/{orderId}/items`
- Version APIs in URL: `/api/`, `/api/v2/`

## HTTP Methods
- `GET` — read (no body, cacheable, idempotent)
- `POST` — create (has body, not idempotent)
- `PUT` — full update/replace (has body, idempotent)
- `PATCH` — partial update (has body, idempotent)
- `DELETE` — remove (idempotent)

## Response Codes
- `200 OK` — successful GET, PUT, PATCH, DELETE
- `201 Created` — successful POST (include Location header)
- `204 No Content` — successful DELETE with no body
- `400 Bad Request` — validation errors
- `401 Unauthorized` — authentication required
- `403 Forbidden` — authenticated but not authorized
- `404 Not Found` — resource does not exist
- `409 Conflict` — duplicate or state conflict
- `422 Unprocessable Entity` — semantically invalid request
- `500 Internal Server Error` — unhandled server error

## Request/Response Format
- Use camelCase for JSON field names
- Always include: `id`, `createdAt`, `updatedAt` in entity responses
- Use ISO 8601 for dates: `2024-01-15T10:30:00Z`
- Wrap collections: `{ "data": [...], "total": 100, "page": 1, "size": 20 }`

## Error Response Format
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": [
    { "field": "email", "message": "must be a valid email" }
  ]
}
```

## Pagination
- Use query params: `?page=0&size=20&sort=createdAt,desc`
- Return pagination metadata in response body
- Default page size: 20, max: 100

## Filtering and Search
- Simple filters: `?status=active&type=premium`
- Date ranges: `?createdAfter=2024-01-01&createdBefore=2024-02-01`
- Search: `?q=search+term`
- Sort: `?sort=field,direction` (e.g., `?sort=name,asc`)

## API Versioning Strategy
- Use URL header versioning as primary
- Increment major version only for breaking changes (field removal, type change, behavior change)
- Support previous version for at least 6 months after deprecation
- Return `Sunset` header on deprecated endpoints: `Sunset: Sat, 01 Jan 2028 00:00:00 GMT`
- Document migration guides between versions

## Security
- Always validate and sanitize input
- Use `@Valid` on request DTOs
- Rate-limit public endpoints
- Never expose internal IDs or stack traces in responses
- Use HTTPS only
