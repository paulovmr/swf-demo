FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-16:latest

USER root

COPY . ./

RUN npm install -g pnpm@7.0.0 \
  && pnpm install \
  && pnpm build

USER 1001

FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/ubi-minimal:latest

RUN microdnf --disableplugin=subscription-manager -y install httpd \
  && microdnf --disableplugin=subscription-manager clean all \
  && sed -i -e 's/Listen 80/Listen 8080/' /etc/httpd/conf/httpd.conf \
  && sed -i -e 's/#ServerName www.example.com:80/ServerName 127.0.0.1:8080/' /etc/httpd/conf/httpd.conf \
  && chgrp -R 0 /var/log/httpd /var/run/httpd /var/www/html \
  && chmod -R g=u /var/log/httpd /var/run/httpd /var/www/html

COPY --from=0 /opt/app-root/src/build /var/www/html

EXPOSE 8080

ENTRYPOINT ["httpd", "-D", "FOREGROUND"]
