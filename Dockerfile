# Stage 1: Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/
RUN npm install -g pnpm && rm -rf packages/backend && pnpm install --frozen-lockfile
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared
RUN cd packages/frontend && pnpm build
RUN mkdir -p packages/backend-java/src/main/resources/static && cp -r packages/frontend/dist/* packages/backend-java/src/main/resources/static/

# Stage 2: Build Java backend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend
WORKDIR /app
COPY packages/backend-java/pom.xml .
COPY --from=frontend /app/packages/backend-java/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend /app/target/backend-java-0.1.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
