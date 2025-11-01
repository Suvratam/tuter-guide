## You should always have three modes/environments for an application lifecycle:

  🧪 **test** — used in CI/CD pipelines (unit/integration testing)  
  💻 **dev** — local developer mode (verbose logging, hot reload, debug)  
  🚀 **prod** — production/release mode (optimized, secure)  

### Each language/framework  — this time with all three environments.

## Go (Gin / General Go)

### Environment Variables

| Mode | Variable            | Description                     |
|------|---------------------|---------------------------------|
| dev  | `GIN_MODE=debug`    | Hot reload, verbose logs        |
| test | `GIN_MODE=test`     | For unit tests, muted logs      |
| prod | `GIN_MODE=release`  | Optimized, no debug output      |
---
### Dockerfile
```
FROM golang:1.19-bullseye AS build
WORKDIR /app
COPY . .

RUN go build -o api-golang
ARG APP_ENV=prod
ENV GIN_MODE=${APP_ENV}

CMD ["./api-golang"]
```

### Then build different images:
```
docker build -t api-golang:dev --build-arg APP_ENV=debug .
docker build -t api-golang:test --build-arg APP_ENV=test .
docker build -t api-golang:prod --build-arg APP_ENV=release .
```
## Python (Flask)

### Environment Variables

| Mode | Variable                  | Description                     |
|------|---------------------------|---------------------------------|
| dev  | `FLASK_ENV=development`   | Enables reloader and debug UI   |
| test | `FLASK_ENV=testing`       | Used for pytest or CI           |
| prod | `FLASK_ENV=production`    | Optimized, no debugger          |
---
### Dockerfile
```
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

ARG APP_ENV=production
ENV FLASK_ENV=${APP_ENV}
ENV FLASK_DEBUG=${APP_ENV:-production} != "production"

CMD ["python", "app.py"]
```

## Python (Django)

### Environment Variables

| Mode | Variable                                  | Description                     |
|------|-------------------------------------------|---------------------------------|
| dev  | `DJANGO_DEBUG=True`                       | Shows detailed errors           |
| test | `DJANGO_SETTINGS_MODULE=myapp.settings_test` | Special DB configs            |
| prod | `DJANGO_DEBUG=False`                      | Optimized templates, no stacktrace |
---
### Dockerfile
```
ARG APP_ENV=prod
ENV DJANGO_SETTINGS_MODULE=myapp.settings_${APP_ENV}
ENV DJANGO_DEBUG=${APP_ENV} != "prod"
```

## Node.js (Express, Next.js, NestJS, etc.)

### Environment Variables

| Mode | Variable                  | Description                     |
|------|---------------------------|---------------------------------|
| dev  | `NODE_ENV=development`    | Hot reload, full logging        |
| test | `NODE_ENV=test`           | Suppresses logs for test        |
| prod | `NODE_ENV=production`     | Minified, optimized             |
---
### Dockerfile
```
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

CMD ["npm", "start"]
```

## Java (Spring Boot)

### Environment Variables

| Mode | Variable                        | Description                     |
|------|---------------------------------|---------------------------------|
| dev  | `SPRING_PROFILES_ACTIVE=dev`    | Local DBs, verbose logs         |
| test | `SPRING_PROFILES_ACTIVE=test`   | In-memory DB, muted logs        |
| prod | `SPRING_PROFILES_ACTIVE=prod`   | Production profile              |

---

### Dockerfile
```
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/myapp.jar .
ARG APP_ENV=prod
ENV SPRING_PROFILES_ACTIVE=${APP_ENV}
CMD ["java", "-jar", "myapp.jar"]
```
## Rust (Rocket / Actix)

### Environment Variables

| Mode | Variable               | Description                     |
|------|------------------------|---------------------------------|
| dev  | `ROCKET_ENV=dev`       | Debugging enabled               |
| test | `ROCKET_ENV=test`      | Quiet logs for CI               |
| prod | `ROCKET_ENV=prod`      | Optimized mode                  |

---

### Dockerfile
```
FROM rust:1.72-bullseye AS build
WORKDIR /app
COPY . .
RUN cargo build --release
FROM debian:bullseye-slim
COPY --from=build /app/target/release/myapp /usr/local/bin/
ARG APP_ENV=prod
ENV ROCKET_ENV=${APP_ENV}
CMD ["myapp"]
```

## PHP (Laravel / Symfony)

### Environment Variables

| Mode | Variable                  | Description                     |
|------|---------------------------|---------------------------------|
| dev  | `APP_ENV=local`           | Verbose debug info              |
| test | `APP_ENV=testing`         | Used for PHPUnit                |
| prod | `APP_ENV=production`      | Optimized, caching on           |

---

### Dockerfile
```
FROM php:8.2-apache
WORKDIR /var/www/html
COPY . .
ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}
ENV APP_DEBUG=$([ "${APP_ENV}" = "local" ] && echo true || echo false)
```

# Manage Multiple Environments

### Summary Table
Use **Docker build args** to control environment-specific variables — **no code changes needed**.

| Language              | Variable                        | `dev`             | `test`            | `prod`            |
|-----------------------|---------------------------------|-------------------|-------------------|-------------------|
| **Go (Gin)**          | `GIN_MODE`                      | `debug`           | `test`            | `release`         |
| **Python (Flask)**    | `FLASK_ENV`                     | `development`     | `testing`         | `production`      |
| **Python (Django)**   | `DJANGO_DEBUG`                  | `True`            | `False`           | `False`           |
| **Node.js**           | `NODE_ENV`                      | `development`     | `test`            | `production`      |
| **Java (Spring Boot)**| `SPRING_PROFILES_ACTIVE`        | `dev`             | `test`            | `prod`            |
| **Rust (Rocket)**     | `ROCKET_ENV`                    | `dev`             | `test`            | `prod`            |
| **PHP (Laravel)**     | `APP_ENV`                       | `local`           | `testing`         | `production`      |

---