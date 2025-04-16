FROM openjdk:21-jdk-slim-buster

COPY code/target/CyberattacksPortal.war CyberattacksPortal.war

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "CyberattacksPortal.war"]