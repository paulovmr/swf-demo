FROM quay.io/kie-tools/serverless-logic-web-tools-base-builder-image:0.26.0

ENV MAVEN_OPTS="-Xmx352m -Xms128m" JAVA_OPTS="-Xmx352m -Xms128m"

RUN mkdir /home/kogito/serverless-workflow-project/

COPY . /home/kogito/serverless-workflow-project/

RUN mvn clean package -B -ntp -f /home/kogito/serverless-workflow-project/pom.xml

ENTRYPOINT ["java", "-jar", "/home/kogito/serverless-workflow-project/target/quarkus-app/quarkus-run.jar"]
