---
name: rabbitmq-patterns
description: Spring AMQP and RabbitMQ messaging patterns. Use when creating producers, consumers, exchanges, queues, dead-letter handling, or any RabbitMQ integration in Spring Boot.
user-invocable: false
---

Follow these Spring AMQP / RabbitMQ patterns:

## Configuration

### Connection & Infrastructure
- Use `spring.rabbitmq.*` properties for connection (host, port, username, password, virtual-host)
- Define exchanges, queues, and bindings in a `@Configuration` class — never rely on auto-declare from listeners alone
- Use `@ConfigurationProperties` for custom queue/exchange names — never hardcode

```java
@Configuration
public class RabbitConfig {
    @Bean
    TopicExchange orderExchange() {
        return ExchangeBuilder.topicExchange("order.exchange")
            .durable(true).build();
    }

    @Bean
    Queue orderCreatedQueue() {
        return QueueBuilder.durable("order.created.queue")
            .withArgument("x-dead-letter-exchange", "order.dlx")
            .withArgument("x-dead-letter-routing-key", "order.created.dlq")
            .build();
    }

    @Bean
    Binding orderCreatedBinding(Queue orderCreatedQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderCreatedQueue)
            .to(orderExchange).with("order.created.#");
    }
}
```

### Message Converter
- Always configure Jackson JSON converter — never use default Java serialization
- Register globally on `RabbitTemplate` and `RabbitListenerContainerFactory`

```java
@Bean
MessageConverter jsonMessageConverter(ObjectMapper objectMapper) {
    return new Jackson2JsonMessageConverter(objectMapper);
}

@Bean
RabbitTemplate rabbitTemplate(ConnectionFactory cf, MessageConverter converter) {
    var template = new RabbitTemplate(cf);
    template.setMessageConverter(converter);
    return template;
}
```

## Producer Patterns

### Publishing Messages
- Use `RabbitTemplate` (injected via constructor) — never create instances manually
- Use a dedicated event/message DTO — never publish JPA entities directly
- Set routing keys descriptively: `order.created`, `payment.completed`

```java
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishOrderCreated(OrderCreatedEvent event) {
        rabbitTemplate.convertAndSend(
            "order.exchange",
            "order.created",
            event
        );
    }
}
```

### Event DTOs
- Use Java records for immutable message payloads
- Include `eventId` (UUID), `timestamp`, and `version` for traceability
- Never include sensitive data (passwords, tokens) in messages

```java
public record OrderCreatedEvent(
    UUID eventId,
    Long orderId,
    String customerEmail,
    BigDecimal totalAmount,
    Instant timestamp
) {
    public OrderCreatedEvent(Long orderId, String customerEmail, BigDecimal totalAmount) {
        this(UUID.randomUUID(), orderId, customerEmail, totalAmount, Instant.now());
    }
}
```

## Consumer Patterns

### Listeners
- Use `@RabbitListener` on service methods, not on controller or repository classes
- Set `concurrency` for parallel consumers where throughput matters
- Always specify `containerFactory` if using custom acknowledgment modes

```java
@Service
@Slf4j
@RequiredArgsConstructor
public class OrderNotificationListener {
    private final NotificationService notificationService;

    @RabbitListener(queues = "${app.rabbitmq.queues.order-created}")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received order.created event: orderId={}", event.orderId());
        notificationService.sendOrderConfirmation(event);
    }
}
```

### Manual Acknowledgment
- Use `AcknowledgeMode.MANUAL` for critical messages that must not be lost
- `channel.basicAck()` after successful processing
- `channel.basicNack(deliveryTag, false, true)` to requeue on transient failure
- `channel.basicNack(deliveryTag, false, false)` to reject to DLQ on permanent failure

```java
@RabbitListener(queues = "payment.queue", ackMode = "MANUAL")
public void handlePayment(PaymentEvent event, Channel channel,
                          @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
    try {
        paymentService.process(event);
        channel.basicAck(tag, false);
    } catch (TransientException e) {
        channel.basicNack(tag, false, true);   // requeue
    } catch (Exception e) {
        channel.basicNack(tag, false, false);   // to DLQ
    }
}
```

## Dead-Letter Handling

- Always configure a DLX (dead-letter exchange) and DLQ for every queue
- Process DLQ messages with a separate listener or scheduled job
- Log DLQ entries with full context (original routing key, exception, retry count)
- Set `x-message-ttl` on retry queues for delayed reprocessing

```java
@Bean
Queue orderDlq() {
    return QueueBuilder.durable("order.created.dlq").build();
}

@Bean
DirectExchange orderDlx() {
    return new DirectExchange("order.dlx");
}

@Bean
Binding dlqBinding(Queue orderDlq, DirectExchange orderDlx) {
    return BindingBuilder.bind(orderDlq).to(orderDlx).with("order.created.dlq");
}
```

## Retry Strategy

- Use Spring Retry with `RetryTemplate` or `@Retryable` for transient failures
- Configure max attempts (3-5), backoff (exponential, initial 1s)
- After max retries, route to DLQ — never retry infinitely

```java
@Bean
SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory cf, MessageConverter converter) {
    var factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(cf);
    factory.setMessageConverter(converter);
    factory.setAdviceChain(RetryInterceptorBuilder.stateless()
        .maxAttempts(3)
        .backOffOptions(1000, 2.0, 10000)
        .recoverer(new RejectAndDontRequeueRecoverer())
        .build());
    return factory;
}
```

## Idempotency

- Consumers MUST be idempotent — messages can be delivered more than once
- Use `eventId` (from the event DTO) as a deduplication key
- Check if already processed before executing business logic
- Store processed event IDs in DB or Redis with TTL

## Exchange Types

| Exchange | Use When |
|---|---|
| **Direct** | Point-to-point, exact routing key match |
| **Topic** | Pattern-based routing (`order.created.#`, `*.payment.*`) |
| **Fanout** | Broadcast to all bound queues |
| **Headers** | Route based on message headers (rare) |

Prefer **topic exchanges** as the default — they offer flexibility for future routing changes.

## Naming Conventions

- Exchange: `{domain}.exchange` (e.g., `order.exchange`)
- Queue: `{domain}.{event}.queue` (e.g., `order.created.queue`)
- DLX: `{domain}.dlx`
- DLQ: `{domain}.{event}.dlq`
- Routing key: `{domain}.{event}` (e.g., `order.created`)

## Transactional Messaging

- Use `RabbitTemplate.invoke()` with channel transactions for publish + DB atomicity
- Or use the **Transactional Outbox pattern**: write event to DB outbox table in the same transaction, then publish via a scheduled poller
- Never publish inside a `@Transactional` method without outbox — if the transaction rolls back, the message is already sent
