-- keycloak
CREATE USER keycloak WITH ENCRYPTED PASSWORD 'keycloak';
CREATE DATABASE keycloak;
GRANT ALL ON DATABASE keycloak TO keycloak;
\c keycloak
GRANT USAGE, CREATE ON SCHEMA public TO keycloak;

-- databases for services
CREATE DATABASE "user";
CREATE DATABASE "chat";
CREATE DATABASE "vocabulary";
