---
name: spring-security-patterns
description: Spring Security patterns for REST APIs. Use when implementing authentication, authorization, JWT, OAuth2, CORS, or security configuration in Spring Boot.
user-invocable: false
---

Follow these Spring Security patterns for REST APIs:

## Security Configuration

### SecurityFilterChain (Spring Boot 3+)
- Use `SecurityFilterChain` bean — never extend `WebSecurityConfigurerAdapter` (removed in Spring Security 6)
- Disable CSRF for stateless REST APIs using JWT
- Configure CORS explicitly
- Use `requestMatchers` (not `antMatchers`, removed in 6.x)

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

## JWT Authentication

### Token Service
- Use `java-jwt` (Auth0) or `jjwt` (io.jsonwebtoken) library
- Store signing key in properties — never hardcode
- Set reasonable expiry: access token (15-30 min), refresh token (7-30 days)
- Include `sub` (user ID), `roles`, `iat`, `exp` in claims

```java
@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${app.jwt.secret}")
    private String secretKey;
    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .subject(userDetails.getUsername())
            .claim("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(getSigningKey())
            .compact();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
```

### JWT Filter
- Extend `OncePerRequestFilter` — runs once per request
- Extract token from `Authorization: Bearer <token>` header
- Validate token, load `UserDetails`, set `SecurityContext`
- Skip filter for public endpoints

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
```

## Authorization

### Method-Level Security
- Use `@PreAuthorize` for role/permission checks on service methods
- Prefer `@PreAuthorize` over `@Secured` — supports SpEL expressions
- Use `@EnableMethodSecurity` (not `@EnableGlobalMethodSecurity`, deprecated)

```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long userId) { ... }

@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
public UserResponse getUser(Long userId) { ... }
```

### Custom Permission Evaluator
- Create `@Component` beans for complex authorization logic
- Reference via SpEL: `@beanName.method(args)`
- Keep authorization logic out of controllers and services

## CORS Configuration

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    var config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000", "https://yourdomain.com"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setMaxAge(3600L);

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}
```

## Error Handling
- Return `401 Unauthorized` for missing/invalid tokens — never `403`
- Return `403 Forbidden` for valid token but insufficient permissions
- Use `AuthenticationEntryPoint` for custom 401 responses
- Use `AccessDeniedHandler` for custom 403 responses
- Never expose stack traces or internal details in auth error responses

## Security Headers
- Spring Security adds most headers by default (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`)
- Configure `Content-Security-Policy` for APIs serving HTML
- Set `Strict-Transport-Security` for HTTPS-only deployments

## Actuator Security
- Expose only `health` and `info` publicly
- Require `ADMIN` role for all other actuator endpoints
- Never expose `env`, `configprops`, `heapdump` without authentication