FROM quay.io/keycloak/keycloak:26.0 AS builder

# Import a specific realm (selvoc-realm.json is safe to use in production)
ARG REALM_FILE=selvoc-realm.json

WORKDIR /opt/keycloak

# Copy only the specified realm file
COPY ./import/${REALM_FILE} /opt/keycloak/data/import/realm.json

COPY ./providers /opt/keycloak/providers

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
