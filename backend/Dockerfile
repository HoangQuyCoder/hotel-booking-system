# ======================
# STAGE 1: BUILD
# ======================
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /build

# Copy Maven wrapper
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src src

# Build jar
RUN ./mvnw clean package -DskipTests -B

# ======================
# STAGE 2: RUNTIME
# ======================
FROM eclipse-temurin:17-jre-jammy

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user 
RUN useradd -m appuser

WORKDIR /app

# Copy jar from stage build
COPY --from=builder --chown=appuser:appuser /build/target/*.jar app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Run app with JVM tuning
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]