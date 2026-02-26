---
name: spring-conventions
description: Spring Boot coding conventions and patterns. Use when writing controllers, services, repositories, configuration classes, or any Spring Boot component.
user-invocable: false
---

Follow these Spring Boot conventions in all code:

## Dependency Injection
- Use **constructor injection**, never `@Autowired` on fields
- Mark constructor `final` fields for immutability
- Use Lombok `@RequiredArgsConstructor` when available

## Layer Conventions

### Controllers
- `@RestController` with `@RequestMapping` at class level
- Method-level `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
- Return `ResponseEntity<T>` for explicit status codes
- Use `@Valid` on request body DTOs
- Never put business logic in controllers

### Services
- `@Service` annotation
- `@Transactional` at method level (not class level)
- Prefer `@Transactional(readOnly = true)` for read operations
- Throw domain-specific exceptions, not generic ones

### Repositories
- Extend `JpaRepository<Entity, ID>` or `CrudRepository<Entity, ID>`
- Use derived query methods where possible
- Use `@Query` with JPQL for complex queries
- Name custom queries descriptively: `findByStatusAndCreatedAfter`

## DTOs and Mapping
- Separate DTOs from entities — never expose entities in API responses
- Use MapStruct for entity-DTO mapping when available
- Use Java records for immutable DTOs (Java 16+)

## Exception Handling
- Use `@ControllerAdvice` with `@ExceptionHandler` for global error handling
- Define domain-specific exceptions extending `RuntimeException`
- Return consistent error response format with status, message, timestamp

## Configuration
- Use `@ConfigurationProperties` for grouped config, not scattered `@Value`
- Use profiles (`application-dev.yml`, `application-prod.yml`) for environment config
- Never hardcode secrets — use environment variables or vault

## Async Processing
- Use `@Async` on service methods for fire-and-forget tasks (email, notifications)
- Always define a custom `TaskExecutor` bean — never rely on the default `SimpleAsyncTaskExecutor`
- Return `CompletableFuture<T>` from async methods when callers need the result
- Enable with `@EnableAsync` on a `@Configuration` class

## Resilience (Resilience4j)
- Use `@CircuitBreaker` on methods calling external services (APIs, messaging)
- Use `@Retry` with exponential backoff for transient failures
- Use `@RateLimiter` for inbound request throttling
- Define fallback methods for graceful degradation
- Configure via `application.yml` under `resilience4j.*` — not in code

## Actuator & Observability
- Always include `spring-boot-starter-actuator`
- Expose `health`, `info`, `prometheus` endpoints; restrict all others
- Create custom `HealthIndicator` beans for external dependencies (DB, RabbitMQ, Redis)
- Use Micrometer for custom metrics: `meterRegistry.counter("orders.created").increment()`
- Use structured logging (JSON) in production — Logback + `logstash-logback-encoder`

## Virtual Threads (Java 21+)
- Enable with `spring.threads.virtual.enabled=true`
- No code changes needed — Tomcat and async tasks automatically use virtual threads
- Avoid `synchronized` blocks in virtual-thread code — use `ReentrantLock` instead
- Safe for blocking I/O (JDBC, RestClient) — that's the whole point

## Naming Conventions
- Packages: `com.company.project.module` (e.g., `com.company.marketplace.order`)
- Classes: `OrderController`, `OrderService`, `OrderRepository`, `OrderEntity`
- Config: `OrderConfig`, `SecurityConfig`
- DTOs: `OrderRequest`, `OrderResponse`, `OrderDto`
- Events: `OrderCreatedEvent`, `PaymentCompletedEvent`
- Listeners: `OrderNotificationListener`, `PaymentEventListener`
