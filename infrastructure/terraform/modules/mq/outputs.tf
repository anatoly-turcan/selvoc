output "mq_endpoint" {
  value = aws_mq_broker.bobo.instances[0].endpoints[0]
}
