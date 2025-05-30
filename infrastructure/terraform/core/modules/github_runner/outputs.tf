output "role_arn" {
  value = aws_iam_role.this.arn
}

output "sg_id" {
  value = aws_security_group.this.id
}
