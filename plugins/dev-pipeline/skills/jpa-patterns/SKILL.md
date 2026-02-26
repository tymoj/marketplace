---
name: jpa-patterns
description: JPA/Hibernate patterns and best practices. Use when designing entities, writing queries, configuring relationships, or troubleshooting persistence issues.
user-invocable: false
---

Follow these JPA/Hibernate patterns:

## Entity Design
- Always define `@Id` with proper generation strategy
- Use `@GeneratedValue(strategy = GenerationType.IDENTITY)` for MySQL auto-increment
- Use `@GeneratedValue(strategy = GenerationType.SEQUENCE)` for Oracle sequences
- Mark audit fields with `@CreatedDate`, `@LastModifiedDate` via `@EntityListeners(AuditingEntityListener.class)`
- Use `@MappedSuperclass` for shared audit fields (BaseEntity pattern)
- Override `equals()` and `hashCode()` using business key or `@Id`, never Lombok `@Data` on entities

## Relationships
- Default `@OneToMany` to `FetchType.LAZY` (already default, but be explicit)
- Default `@ManyToOne` to `FetchType.LAZY` (override the EAGER default)
- Use `@JoinColumn` to control FK column name
- For bidirectional: always set `mappedBy` on the non-owning side
- Use helper methods (`addChild`, `removeChild`) to keep both sides in sync
- Avoid `CascadeType.ALL` — be explicit about which cascades you need

## N+1 Prevention
- Use `JOIN FETCH` in JPQL for known eager-load scenarios
- Use `@EntityGraph` for dynamic fetch strategies
- Use `@BatchSize(size = 20)` on lazy collections for batch loading
- Monitor with `spring.jpa.show-sql=true` in dev (never in prod)

## Query Patterns
- Prefer Spring Data derived methods for simple queries: `findByStatusAndType`
- Use `@Query` with JPQL for joins and projections
- Use native queries (`nativeQuery = true`) only when JPQL cannot express it
- Use Specifications for dynamic/composable queries
- Use `Pageable` parameter for pagination, never manual LIMIT/OFFSET in JPQL

## Performance
- Use `@Transactional(readOnly = true)` for read queries (enables Hibernate dirty-check skip)
- Use projections (interfaces or DTOs) to avoid loading full entities for read-only views
- Use `@Version` for optimistic locking on entities with concurrent write risk
- Prefer `existsBy*` over `findBy*` + null check for existence checks

## Migration Integration
- Flyway or Liquibase for schema migrations (never `ddl-auto=update` in prod)
- Migration file naming: `V{version}__{description}.sql` (Flyway) or `changelog-{version}.xml` (Liquibase)
- Always test migrations against a real DB in CI
