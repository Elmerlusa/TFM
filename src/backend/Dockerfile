FROM openjdk:21-jdk-slim-buster

RUN apt-get update \
	&& apt-get install -y curl

COPY code/target/CyberattacksPortal.war CyberattacksPortal.war

EXPOSE 8000

ENTRYPOINT ["java", "-jar", "CyberattacksPortal.war"]