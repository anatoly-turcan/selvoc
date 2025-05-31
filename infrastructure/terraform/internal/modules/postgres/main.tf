# Create PostgreSQL database for each service
resource "postgresql_database" "service_db" {
  for_each = var.services

  name              = each.key
  owner             = postgresql_role.service_role[each.key].name
  connection_limit  = -1
  allow_connections = true
}

# Create PostgreSQL role for each service
resource "postgresql_role" "service_role" {
  for_each = var.services

  name     = "${each.key}_${random_string.postgres_username_suffix_service[each.key].result}"
  login    = true
  password = random_password.postgres_service[each.key].result

  create_database = false
  create_role     = false
  inherit         = true
  replication     = false
}

# Grant privileges to the role for the database
resource "postgresql_grant" "service_db_grant" {
  for_each = var.services

  database    = postgresql_database.service_db[each.key].name
  role        = postgresql_role.service_role[each.key].name
  object_type = "database"
  privileges  = ["ALL"]
}
