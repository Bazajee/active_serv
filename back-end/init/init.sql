-- update with .env
GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO 'test_user'@'%';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS shadow_database;

