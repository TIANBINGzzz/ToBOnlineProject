FROM maven:3.9.9-amazoncorretto-17 AS build

WORKDIR /app
COPY ./bridge/pom.xml ./
COPY ./bridge/project-service/pom.xml ./project-service/
COPY ./bridge/bridge-common/pom.xml ./bridge-common/
COPY ./bridge/user-service/pom.xml ./user-service/
COPY ./bridge/bridge-gateway/pom.xml ./bridge-gateway/
COPY ./bridge/application-service/pom.xml ./application-service/
COPY ./bridge/bridge-api/pom.xml ./bridge-api/
COPY ./bridge/notification-service/pom.xml ./notification-service/

COPY ./bridge/project-service/src ./project-service/src
COPY ./bridge/bridge-common/src ./bridge-common/src
COPY ./bridge/user-service/src ./user-service/src
COPY ./bridge/bridge-gateway/src ./bridge-gateway/src
COPY ./bridge/application-service/src ./application-service/src
COPY ./bridge/bridge-api/src ./bridge-api/src
COPY ./bridge/notification-service/src ./notification-service/src

RUN mkdir -p /root/.m2/repository

RUN mvn install -f ./pom.xml -DskipTests
RUN mvn install -f ./bridge-common/pom.xml -DskipTests
RUN mvn install -f ./bridge-api/pom.xml -DskipTests
RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests

FROM amazoncorretto:17
WORKDIR /app
COPY --from=build /app/bridge-gateway/target/bridge-gateway-0.0.1.jar /app/bridge-gateway.jar
ENTRYPOINT ["java", "-jar", "/app/bridge-gateway.jar"]