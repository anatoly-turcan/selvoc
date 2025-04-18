# provider "postgresql" {
#   host     = aws_db_instance.postgres.address
#   port     = aws_db_instance.postgres.port
#   database = "postgres"
#   username = aws_db_instance.postgres.username
#   password = aws_db_instance.postgres.password
#   sslmode  = "require"
# }

# resource "postgresql_database" "keycloak" {
#   name = "keycloak"
# }

# resource "postgresql_database" "user" {
#   name = "user"
# }

# resource "postgresql_database" "chat" {
#   name = "chat"
# }

# resource "postgresql_database" "vocabulary" {
#   name = "vocabulary"
# }
