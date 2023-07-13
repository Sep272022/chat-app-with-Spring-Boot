# Build
FROM maven:3.8.2-openjdk-17-slim AS build
WORKDIR /build
COPY ./pom.xml ./pom.xml
RUN mvn dependency:go-offline -B
COPY ./src ./src
RUN mvn clean package -DskipTests

# Package
FROM openjdk:22 as package
WORKDIR /app
COPY --from=build /build/target/*.jar /app/chat-app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "chat-app.jar"]
