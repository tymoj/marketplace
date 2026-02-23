# Implementation Plan: Example Feature

**Instructions for Subagents:**
This plan serves as the source of truth for the implementation of the Example feature. Check off tasks `[x]` as they are completed. Constantly update this file if new challenges arise.

## Phase 1: Context & Tech Stack Overview
- **Tech Stack Detected:** Java 17, Spring Boot 3, Gradle (`build.gradle`), PostgreSQL, Liquibase.
- **Architectural Pattern:** Standard 3-layer architecture (Controller -> Service -> Repository).
- **Goal:** Implement a REST endpoint to fetch user notifications and a scheduled job to auto-generate daily reminder notifications.

## Phase 2: Analysis & Scope
- **Files to Modify:**
  - `src/main/resources/db/changelog/db.changelog-master.xml` (Liquibase)
  - `src/main/java/com/app/notifications/NotificationController.java` (New)
  - `src/main/java/com/app/notifications/NotificationService.java` (New)
  - `src/main/java/com/app/notifications/NotificationRepository.java` (New)
  - `src/main/java/com/app/notifications/NotificationEntity.java` (New)
- **Data Flow:** Client -> NotificationController -> NotificationService -> NotificationRepository -> PostgreSQL.
- **Identified Edge Cases:** 
  - Ensure pagination is used so the database isn't overloaded when fetching notifications.
  - Ensure users can only fetch their *own* notifications (Authorization check required).
- **Tools Required for Implementation:** `Read`, `Edit`, `Bash` (for `./gradlew build` and `./gradlew test`).

## Phase 3: Step-by-Step Implementation

### Sub-Phase 3.1: Database Layer (Parallelizable: DB Agent)
**Required Subagent Tools:** `Edit`, `Bash`
- [ ] **Task 1:** Create Liquibase migration `db.changelog-v1.2-notifications.xml`.
  - Columns: `id` (UUID), `user_id` (UUID), `message` (VARCHAR), `is_read` (BOOLEAN), `created_at` (TIMESTAMP).
- [ ] **Task 2:** Create `NotificationEntity.java` with JPA annotations (`@Entity`, `@Table`).
- [ ] **Task 3:** Create `NotificationRepository.java` extending `JpaRepository`. Add a custom method `findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable)`.
- **Verification:** Run `./gradlew test` and verify Spring Data JPA context loads cleanly.

### Sub-Phase 3.2: Service Layer & Scheduling (Sequential: Requires DB Layer)
**Required Subagent Tools:** `Edit`
- [ ] **Task 4:** Create `NotificationDTO.java` to avoid exposing the raw entity to the controller.
- [ ] **Task 5:** Create `NotificationService.java` (annotate with `@Service`). Implement `getNotificationsForUser(UUID userId, int page, int size)`.
- [ ] **Task 6:** Create `DailyReminderScheduler.java` (annotate with `@Component`). Use `@Scheduled(cron = "0 0 9 * * ?")` to insert records via the Repository.
- **Verification:** Write unit test `NotificationServiceTest.java` mocking the repository.

### Sub-Phase 3.3: API / Controller Layer (Parallelizable: API Agent)
**Required Subagent Tools:** `Edit`, `Bash`
- [ ] **Task 7:** Create `NotificationController.java` (annotate with `@RestController`, `@RequestMapping("/api/v1/notifications")`).
- [ ] **Task 8:** Implement GET endpoint `/api/v1/notifications`. Extract the current user's ID from the JWT/SecurityContext to enforce authorization.
- [ ] **Task 9:** Implement POST endpoint `/api/v1/notifications/{id}/read` to mark a notification as read.
- **Verification:** Write integration test `NotificationControllerIT.java` using `@WebMvcTest` or `@SpringBootTest` with HTTP requests. Run `./gradlew build`.

## Phase 4: Plan Validation (Clarifying Questions for the User)
Before we start writing code, please clarify the following missing requirements:

1. **Security:** Are you using Spring Security's `SecurityContextHolder` to extract the logged-in user's ID, or is it passed via a custom header?
2. **Deletion:** Should users be able to permanently delete their notifications, or just mark them as "read"?
3. **Paging Defaults:** What should the default page size be when fetching notifications if the user doesn't specify one? (e.g., 20 items per page?)
