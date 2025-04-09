# Postgres

## Install

```bash
kubectl apply -f secrets.yaml -n bobo
helm install postgres oci://registry-1.docker.io/bitnamicharts/postgresql -f values.yaml -n bobo
```
