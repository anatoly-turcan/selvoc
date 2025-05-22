locals {
  endpoint = aws_mq_broker.this.instances[0].endpoints[0]
  hostname = replace(local.endpoint, "/^amqps:\\/\\/|:\\d+$/", "")
}
