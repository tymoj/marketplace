---
name: testing-strategy-java
description: Java/Spring Boot testing conventions. JUnit 5, Mockito, @DataJpaTest, @WebMvcTest, @SpringBootTest, Testcontainers. Use when writing or reviewing Java tests.
user-invocable: false
---

Java/Spring Boot testing conventions.

## Frameworks
- **Unit tests**: JUnit 5 + Mockito
- **Repository tests**: `@DataJpaTest` (Spring)
- **Controller tests**: `@WebMvcTest` (Spring)
- **Integration tests**: `@SpringBootTest` + Testcontainers
- **Assertions**: AssertJ preferred over JUnit assertions

## Unit Tests (Service / Utility)

```java
@ExtendWith(MockitoExtension.class)  // NEVER @RunWith
class OrderServiceTest {
    @Mock OrderRepository orderRepository;
    @Mock PaymentService paymentService;
    @InjectMocks OrderService orderService;

    @Test
    void should_createOrder_when_validInput() {
        // Arrange
        var request = OrderFixture.validCreateRequest();
        when(orderRepository.save(any())).thenReturn(OrderFixture.savedOrder());

        // Act
        var result = orderService.createOrder(request);

        // Assert
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(orderRepository).save(any(Order.class));
    }
}
```

### Rules
- `@Mock` for dependencies, `@InjectMocks` for the class under test
- Never call `MockitoAnnotations.openMocks()` — use `@ExtendWith`
- Use `verify()` sparingly — prefer asserting on return values
- Use `ArgumentCaptor` when you need to inspect saved entities

## Repository Tests

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)  // if using Testcontainers
class OrderRepositoryTest {
    @Autowired OrderRepository orderRepository;
    @Autowired TestEntityManager entityManager;

    @Test
    void should_findByStatus_when_ordersExist() {
        entityManager.persistAndFlush(OrderFixture.pendingOrder());
        var results = orderRepository.findByStatus(OrderStatus.PENDING);
        assertThat(results).hasSize(1);
    }
}
```

### Rules
- `@DataJpaTest` auto-configures JPA + in-memory DB (H2)
- Use `TestEntityManager` for setup, repository methods for assertions
- Add `@AutoConfigureTestDatabase(replace = NONE)` for Testcontainers
- `@Transactional` is automatic — each test rolls back

## Controller Tests

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean OrderService orderService;

    @Test
    void should_return200_when_getOrder() throws Exception {
        when(orderService.findById(1L)).thenReturn(OrderFixture.dto());

        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void should_return404_when_orderNotFound() throws Exception {
        when(orderService.findById(1L)).thenThrow(new ResourceNotFoundException("Order", 1L));

        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isNotFound());
    }
}
```

### Rules
- `@WebMvcTest` loads only the web layer — no full context
- `@MockBean` for service dependencies (not `@Mock`)
- Test HTTP status codes, response body, content type, headers
- Test validation errors (400), auth errors (401/403), not found (404)

## Integration Tests

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class OrderIntegrationTest {
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired TestRestTemplate restTemplate;

    @Test
    void should_createAndRetrieveOrder() {
        var response = restTemplate.postForEntity("/api/orders", request, OrderDTO.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

### Rules
- Use sparingly — slow and expensive
- Testcontainers for real DB (don't rely on H2 dialect differences)
- `@DynamicPropertySource` for container connection details
- Test complete flows: create → retrieve → update → delete

## File Structure
```
src/test/java/com/company/project/
├── controller/
│   └── OrderControllerTest.java       @WebMvcTest
├── service/
│   └── OrderServiceTest.java          Unit + Mockito
├── repository/
│   └── OrderRepositoryTest.java       @DataJpaTest
├── integration/
│   └── OrderIntegrationTest.java      @SpringBootTest
└── fixture/
    └── OrderFixture.java              Test data factory
```

## RabbitMQ Listener Tests

### Unit Test (mock RabbitTemplate)
```java
@ExtendWith(MockitoExtension.class)
class OrderEventPublisherTest {
    @Mock RabbitTemplate rabbitTemplate;
    @InjectMocks OrderEventPublisher publisher;

    @Test
    void should_publishEvent_when_orderCreated() {
        var event = new OrderCreatedEvent(1L, "user@test.com", BigDecimal.TEN);

        publisher.publishOrderCreated(event);

        verify(rabbitTemplate).convertAndSend(
            eq("order.exchange"), eq("order.created"), eq(event));
    }
}
```

### Listener Unit Test
```java
@ExtendWith(MockitoExtension.class)
class OrderNotificationListenerTest {
    @Mock NotificationService notificationService;
    @InjectMocks OrderNotificationListener listener;

    @Test
    void should_sendNotification_when_orderCreatedEventReceived() {
        var event = new OrderCreatedEvent(1L, "user@test.com", BigDecimal.TEN);

        listener.handleOrderCreated(event);

        verify(notificationService).sendOrderConfirmation(event);
    }
}
```

### Integration Test (Testcontainers + RabbitMQ)
```java
@SpringBootTest
@Testcontainers
class OrderMessagingIntegrationTest {
    @Container
    static RabbitMQContainer rabbit = new RabbitMQContainer("rabbitmq:3.12-management");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.rabbitmq.host", rabbit::getHost);
        registry.add("spring.rabbitmq.port", rabbit::getAmqpPort);
        registry.add("spring.rabbitmq.username", rabbit::getAdminUsername);
        registry.add("spring.rabbitmq.password", rabbit::getAdminPassword);
    }

    @Autowired RabbitTemplate rabbitTemplate;
    @Autowired OrderRepository orderRepository;

    @Test
    void should_processOrder_when_messageReceivedFromQueue() {
        var event = new OrderCreatedEvent(1L, "user@test.com", BigDecimal.TEN);

        rabbitTemplate.convertAndSend("order.exchange", "order.created", event);

        // Wait for async consumer with Awaitility
        await().atMost(5, SECONDS).untilAsserted(() ->
            assertThat(orderRepository.findById(1L)).isPresent()
        );
    }
}
```

### Rules
- Unit-test listeners as plain methods — no need for a running broker
- Use Testcontainers `RabbitMQContainer` for integration tests
- Use Awaitility for async assertions — never `Thread.sleep()`
- Test DLQ routing by publishing invalid messages and asserting DLQ count

## Security Tests

```java
@WebMvcTest(OrderController.class)
@Import(SecurityConfig.class)
class OrderControllerSecurityTest {
    @Autowired MockMvc mockMvc;
    @MockBean OrderService orderService;

    @Test
    @WithMockUser(roles = "USER")
    void should_return200_when_authenticatedUser() throws Exception {
        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk());
    }

    @Test
    void should_return401_when_noToken() throws Exception {
        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void should_return403_when_notAdmin() throws Exception {
        mockMvc.perform(delete("/api/admin/users/1"))
            .andExpect(status().isForbidden());
    }
}
```

## Naming Convention
- `should_expectedBehavior_when_condition`
- Or: `methodName_stateUnderTest_expectedBehavior`
