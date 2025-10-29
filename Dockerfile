# Dockerfile (în rădăcina proiectului)
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiază fișierele Maven
COPY blog_server/mvnw .
COPY blog_server/.mvn .mvn
COPY blog_server/pom.xml .

# Make mvnw executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copiază codul sursă
COPY blog_server/src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/blog_server-0.0.1-SNAPSHOT.jar"]