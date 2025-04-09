# RabbitMQ

## Install

```bash
kubectl apply -f secrets.yaml -n bobo
helm install rabbitmq oci://registry-1.docker.io/bitnamicharts/rabbitmq -f values.yaml -n bobo
```
