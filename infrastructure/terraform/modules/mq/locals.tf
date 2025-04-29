locals {
  endpoint = aws_mq_broker.bobo.instances[0].endpoints[0]
  hostname = replace(local.endpoint, "/^amqps:\\/\\/|:\\d+$/", "")
}
