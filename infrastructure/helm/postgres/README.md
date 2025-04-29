# Postgres

## Configure

```bash
cp secretes-template.yaml secrets.yaml
```

- Update `secrets.yaml` with your own values.

```bash
kubectl apply -f secrets.yaml -n bobo
```

## Install

```bash
helm install postgres oci://registry-1.docker.io/bitnamicharts/postgresql -f values.yaml -n bobo
```
