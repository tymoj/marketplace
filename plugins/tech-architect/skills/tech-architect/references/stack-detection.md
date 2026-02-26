# Stack Detection Reference

This file is read by the `tech-architect` routing skill to identify tech stack signals from build files.

---

## Gradle (`build.gradle` / `build.gradle.kts`)

### Spring Boot Detection
| Signal | Pattern (Groovy) | Pattern (Kotlin DSL) |
|--------|-----------------|----------------------|
| Boot plugin | `id 'org.springframework.boot'` | `id("org.springframework.boot")` |
| Boot dependency | `spring-boot-starter` (any variant) | `spring-boot-starter` (any variant) |
| Boot dependency management | `id 'io.spring.dependency-management'` | `id("io.spring.dependency-management")` |

### Spring Boot Version Extraction
- Groovy: `id 'org.springframework.boot' version '3.2.0'` → extract `3.2.0`
- Kotlin DSL: `id("org.springframework.boot") version "3.2.0"` → extract `3.2.0`

### Java Version Extraction
- `sourceCompatibility = '21'` or `sourceCompatibility = JavaVersion.VERSION_21`
- `java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }`

### Build Tool Variant
- File `build.gradle` → Gradle (Groovy DSL)
- File `build.gradle.kts` → Gradle (Kotlin DSL)

### Multi-Module Detection
- `settings.gradle` or `settings.gradle.kts` with `include(...)` entries → multi-module project

---

## Maven (`pom.xml`)

### Spring Boot Detection
| Signal | Pattern |
|--------|---------|
| Boot parent | `<artifactId>spring-boot-starter-parent</artifactId>` inside `<parent>` |
| Boot dependency | `<artifactId>spring-boot-starter*</artifactId>` in `<dependencies>` |
| Boot plugin | `<artifactId>spring-boot-maven-plugin</artifactId>` in `<build><plugins>` |

### Spring Boot Version Extraction
- From `<parent>`: `<version>3.2.0</version>` immediately after `spring-boot-starter-parent`
- From properties: `<spring-boot.version>3.2.0</spring-boot.version>`

### Java Version Extraction
- `<java.version>21</java.version>` in `<properties>`
- `<maven.compiler.source>21</maven.compiler.source>`
- `<release>21</release>` in compiler plugin config

### Multi-Module Detection
- `<packaging>pom</packaging>` at root with `<modules>` entries → multi-module Maven project

---

## Node.js (`package.json`)

### Framework Detection
| Key in `dependencies` or `devDependencies` | Framework |
|--------------------------------------------|-----------|
| `express` | Express |
| `@nestjs/core` | NestJS |
| `next` | Next.js |
| `fastify` | Fastify |
| `@hapi/hapi` | Hapi |
| `koa` | Koa |

### Node Version Extraction
- `"engines": { "node": ">=20" }` → extract version
- `.nvmrc` or `.node-version` file (separate glob)

---

## Python (`pyproject.toml` / `requirements.txt`)

### Framework Detection
| Pattern | Framework |
|---------|-----------|
| `fastapi` in dependencies | FastAPI |
| `django` in dependencies | Django |
| `flask` in dependencies | Flask |

### Python Version Extraction
- `pyproject.toml`: `python = "^3.12"` under `[tool.poetry.dependencies]`
- `pyproject.toml`: `requires-python = ">=3.12"` under `[project]`

---

## Tool Version Files

### `.tool-versions` (asdf)
```
java corretto-21.0.3.9.1
nodejs 20.11.0
python 3.12.0
```
Parse each line: `<tool> <version>`.

### `.java-version` (jenv / jabba)
Single line with Java version string, e.g. `21`.

---

## Oracle Database Detection

Oracle is detected from **multiple sources** — check all of them:

### JDBC URL (highest confidence)
Scan `application.properties`, `application.yml`, `application-*.yml` for:
```
jdbc:oracle:thin:@
```
Extract host, port, and service name / SID from the URL, e.g.:
- `jdbc:oracle:thin:@//db-host:1521/ORCL` → service name `ORCL`
- `jdbc:oracle:thin:@db-host:1521:ORCL` → SID `ORCL` (legacy format)

### Build file dependency (high confidence)
| Pattern | File |
|---------|------|
| `ojdbc11`, `ojdbc8`, `ojdbc6` | `build.gradle` / `pom.xml` |
| `com.oracle.database.jdbc` | group ID in any build file |
| `oracle.jdbc.OracleDriver` | any property or config file |

### Docker Compose image (medium confidence)
| Pattern | Signal |
|---------|--------|
| `container-registry.oracle.com/database/free` | Oracle Database Free |
| `container-registry.oracle.com/database/enterprise` | Oracle Database Enterprise |
| `gvenzl/oracle-free` | Oracle Free (community image) |
| `gvenzl/oracle-xe` | Oracle XE (community image) |

### Version extraction
From JDBC URL or datasource config comments: `Oracle 19c`, `Oracle 21c`, `Oracle 23ai`.
Fallback to `Oracle (version unknown)` if no version can be determined.

---

## Infrastructure Signals (`docker-compose.yml`)

Scan service `image:` values and service names for:

| Pattern | Signal |
|---------|--------|
| `mysql` or `mariadb` | MySQL/MariaDB database |
| `redis` | Redis cache |
| `kafka` or `confluentinc/cp-kafka` | Apache Kafka |
| `rabbitmq` | RabbitMQ |
| `mongodb` or `mongo` | MongoDB |
| `elasticsearch` | Elasticsearch |
| `keycloak` | Keycloak (auth) |

Include detected infrastructure services in the stack summary, e.g. `"Spring Boot 3.2, Java 21, Gradle, Oracle 19c, Redis"`.
