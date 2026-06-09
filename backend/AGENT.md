# Backend Agent Guide for Frontend Work

This backend is a Spring Boot API for the Dynamic Form Generator frontend. Use this file as the quick contract map before changing frontend API calls.

## Runtime

- Backend folder: `backend`
- Entry point: `src/main/java/org/project/Main.java`
- Build tool: Maven
- Run command: `mvn spring-boot:run`
- Config file: `src/main/resources/application.properties`
- Expected local API origin: `http://localhost:8080`
- Frontend origin allowed by CORS: `http://localhost:5173`

Required environment variables are read through `application.properties`:

```properties
DB_URL
DB_USERNAME
DB_PASSWORD
SERVER_PORT
JWT_SECRET
JWT_EXPIRATION
JWT_ISSUER
```

The project uses Spring Boot Web, Spring Security, Spring Data JPA, Hibernate, MySQL, Lombok, JJWT, and `spring-dotenv`.

## Package Map

- `controllers`: REST endpoints for auth, users, forms, and submissions.
- `service`: Business logic and transaction boundaries.
- `repositories`: Spring Data JPA repositories.
- `entities`: JPA persistence models returned by many endpoints.
- `dto`: Request/response DTOs used mostly for auth and form creation.
- `jwt`: JWT cookie/header authentication filter and token utility.
- `config`: Security, CORS, JWT property config.
- `mapToJsonConverter`: JPA converters for map-like fields stored as JSON text.

## Authentication Model

Login is cookie-based by default.

- `POST /auth/login` accepts `{ "username": "...", "password": "..." }`.
- On success it returns an empty `200 OK` body and sets an HTTP-only cookie named `authToken`.
- The JWT filter also accepts `Authorization: Bearer <token>`, but the frontend currently relies on the cookie.
- Frontend requests to protected endpoints must include credentials:
  - `fetch(..., { credentials: "include" })`
  - `axios.create({ withCredentials: true })`
- CORS allows credentials only from `http://localhost:5173`.

The current user can be read with:

```http
GET /auth/user
```

Response shape:

```json
{
  "id": "uuid",
  "username": "name",
  "emailid": "user@example.com",
  "contact": 9999999999,
  "role": "USER",
  "enabled": true
}
```

## Real API Routes

The root README has older `/api/...` examples. The actual backend routes are these:

### Auth

- `POST /auth/login`: public login, sets `authToken` cookie.
- `POST /auth/logout`: clears the Spring security context for the request.
- `GET /auth/verify`: protected, returns boolean.
- `GET /auth/user`: protected, returns `UserDto`.

### Users

- `POST /user/save`: public registration.
- `PUT /user/update`: `ROLE_USER` or `ROLE_ADMIN`.
- `PUT /user/toggle/{id}`: `ROLE_ADMIN`.
- `GET /user/get/{id}`: `ROLE_USER` or `ROLE_ADMIN`.
- `GET /user/all`: `ROLE_ADMIN`.
- `DELETE /user/delete/{id}`: `ROLE_ADMIN`.

Registration payload maps directly to `User`:

```json
{
  "username": "Jane Doe",
  "password": "secret",
  "emailid": "jane@example.com",
  "contact": 9999999999,
  "role": "USER"
}
```

`role` can be omitted; the entity default is `USER`. Passwords are BCrypt-hashed in `UserService.addUser`.

### Forms

- `POST /form/save`: `ROLE_USER` or `ROLE_ADMIN`.
- `GET /form/get/{id}`: `ROLE_USER` or `ROLE_ADMIN`.
- `GET /form/all`: `ROLE_ADMIN`.
- `PUT /form/update`: `ROLE_USER` or `ROLE_ADMIN`.
- `PUT /form/toggle/{id}`: `ROLE_USER` or `ROLE_ADMIN`.
- `DELETE /form/delete/{id}`: `ROLE_ADMIN`.

Create form payload uses `FormDto`:

```json
{
  "title": "Customer Feedback",
  "category": "Survey",
  "active": true,
  "questions": [
    {
      "type": "text",
      "label": "Full name",
      "placeholder": "Enter your name",
      "required": true,
      "order": 1,
      "options": []
    },
    {
      "type": "select",
      "label": "Rating",
      "placeholder": "",
      "required": true,
      "order": 2,
      "options": ["Good", "Average", "Poor"]
    }
  ]
}
```

Important: `POST /form/save` ignores the frontend-supplied `user` object and uses the authenticated username from Spring Security to attach the form to the current user.

Returned forms are `FormData` entities:

```json
{
  "formid": "uuid",
  "title": "Customer Feedback",
  "category": "Survey",
  "questions": [
    {
      "questionid": "uuid",
      "question": "Full name",
      "answer_type": "text",
      "options": [],
      "placeholder": "Enter your name",
      "is_required": true,
      "validations": null,
      "defaultValue": null,
      "orderno": 1
    }
  ],
  "submissions": [],
  "createdAt": "2026-06-09T12:00:00",
  "isActive": true
}
```

Notice the naming difference:

- Frontend create DTO uses `label`, `type`, `required`, `order`.
- Backend entity responses use `question`, `answer_type`, `is_required`, `orderno`.

### Submissions

- `POST /submission/save`: `ROLE_USER` or `ROLE_ADMIN`.
- `GET /submission/all`: `ROLE_ADMIN`.
- `GET /submission/get/{id}`: `ROLE_USER` or `ROLE_ADMIN`.
- `GET /submission/form/{id}`: controller route exists and returns submissions for a form.
- `PUT /submission/update`: `ROLE_USER` or `ROLE_ADMIN`.
- `DELETE /submission/delete/{id}`: controller route exists.

Submission create payload maps to `FormSubmissions` and must include an existing form id plus answer question ids:

```json
{
  "emailid": "submitter@example.com",
  "form": {
    "formid": "form-uuid"
  },
  "answers": [
    {
      "question": {
        "questionid": "question-uuid"
      },
      "response": {
        "value": "Jane Doe"
      }
    }
  ]
}
```

`response` is a `Map<String, Object>` stored as JSON text through `AnswerConverter`, so the frontend can send object-shaped answer data.

## Frontend Integration Notes

- Use `http://localhost:8080` as the base backend URL unless `SERVER_PORT` changes.
- Include credentials on every protected request.
- Do not expect a token in the `/auth/login` JSON response; success is represented by the `Set-Cookie` header.
- The cookie is HTTP-only, so `document.cookie` will not reliably show `authToken`.
- Use `/auth/verify` and `/auth/user` to restore auth state after page refresh.
- Keep create-form payloads in DTO naming, but render fetched forms using entity naming.
- Admin-only routes will return `403` for normal users.

## Known Backend Gotchas

- Security config has method mismatches for two submission routes:
  - It protects `POST /submission/form/{id}`, but the controller exposes `GET /submission/form/{id}`.
  - It protects `POST /submission/delete/{id}`, but the controller exposes `DELETE /submission/delete/{id}`.
- `POST /auth/logout` does not explicitly expire the `authToken` cookie in the response.
- `GET /form/all` is admin-only, so a normal user frontend should not depend on it unless roles are changed.
- Some responses return full JPA entities, not DTOs. Jackson references prevent many cycles, but response field names follow entity names.
- `FormService.getFormById` throws `"User not found"` when a form is missing; treat 500-like failures carefully in the UI.

## Backend Change Pointers

- Add or change endpoints in `controllers/*Controller.java`.
- Change form creation payload handling in `dto/FormDto.java`, `dto/QuestionDto.java`, and `entities/FormData.java`.
- Change persisted form response shape in `entities/FormData.java` and `entities/Question.java`.
- Change submission payload/response shape in `entities/FormSubmissions.java` and `entities/Answer.java`.
- Change auth/CORS/role rules in `config/SecurityConfig.java`.
- Change JWT cookie/header behavior in `controllers/AuthController.java` and `jwt/JwtAuthenticationFilter.java`.

